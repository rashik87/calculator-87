import React, { useState, useEffect, useCallback } from 'react';
import { 
    UserData, DietProtocol, Macros, CarbCycleConfig, IntermittentFastingConfig, Goal, GoalSettings, 
    FoodItem, AppView, Recipe, PlannedRecipeMeal, SimulatedUser, AuthView, WeightEntry 
} from './types';

// Components
import UserInputForm from './components/UserInputForm';
import GoalSelector from './components/GoalSelector';
import DietSelector from './components/DietSelector';
import ResultsDisplay from './components/ResultsDisplay';
import CarbCycleConfigurator from './components/CarbCycleConfigurator';
import IntermittentFastingConfigurator from './components/IntermittentFastingConfigurator';
import FoodDatabaseView from './components/FoodDatabaseView';
import RecipeListView from './components/RecipeListView';
import RecipeCreationView from './components/RecipeCreationView';
import RecipeDetailView from './components/RecipeDetailView';
import RecipeDrivenMealPlanView from './components/RecipeDrivenMealPlanView';
import SelectRecipeModal from './components/SelectRecipeModal';
import LoginView from './components/auth/LoginView';
import RegisterView from './components/auth/RegisterView';
import ProgressTrackingView from './components/progress/ProgressTrackingView';
import UserDashboardView from './components/UserDashboardView'; // Import new component


// Services
import { calculateBMR, calculateTDEE, calculateMacros, calculateAdjustedTDEE } from './services/calorieService';
import * as DataStorageService from './services/dataStorageService'; 
import * as AuthService from './services/authService';

// Constants
import { 
  APP_TITLE, LOGO_URL, PREDEFINED_FOOD_ITEMS, FOOD_DATABASE_NAVIGATION_LINK, RECIPES_NAVIGATION_LINK, 
  RECIPE_SAVED_SUCCESSFULLY, ERROR_SAVING_RECIPE, BACK_TO_RECIPES_BUTTON, 
  RECIPE_DRIVEN_MEAL_PLAN_NAVIGATION_LINK, 
  CALCULATE_NEEDS_FIRST_PROMPT, DEFAULT_NUMBER_OF_MEALS, MEAL_SLOT_NAME_PREFIX,
  PLAN_ADJUSTED_SUCCESSFULLY, PLAN_ADJUSTMENT_ERROR_NO_TARGET_MACROS, PLAN_ADJUSTMENT_ERROR_NO_RECIPES,
  PLAN_ADJUSTMENT_ERROR_ZERO_CALORIES, ERROR_LOADING_RECIPE_FOR_PLAN,
  LOGIN_TITLE, REGISTER_TITLE, LOGOUT_BUTTON, AUTH_SUCCESS_REGISTER, LOADING_MESSAGE,
  MAIN_CALCULATOR_NAV_LINK, RESET_CALCULATOR_NAV_LINK, PROGRESS_TRACKING_NAV_LINK, ENTRY_SAVED_SUCCESS,
  RECIPE_DELETED_SUCCESSFULLY, ERROR_DELETING_RECIPE, USER_DASHBOARD_NAV_LINK
} from './constants';


const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<SimulatedUser | null>(AuthService.getCurrentUser());
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [appInitializationDone, setAppInitializationDone] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);


  // Calculator State
  const [userData, setUserData] = useState<UserData | null>(null);
  const [goalSettings, setGoalSettings] = useState<GoalSettings | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<DietProtocol>(DietProtocol.NONE);
  const [initialTdee, setInitialTdee] = useState<number | null>(null);
  const [finalTdee, setFinalTdee] = useState<number | null>(null);
  const [userTargetMacros, setUserTargetMacros] = useState<Macros | null>(null);
  const [carbCycleConfig, setCarbCycleConfig] = useState<CarbCycleConfig | null>(null);
  const [intermittentFastingConfig, setIntermittentFastingConfig] = useState<IntermittentFastingConfig | null>(null);
  
  // Data State (User-Specific)
  const [allFoodItems, setAllFoodItems] = useState<FoodItem[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipeForDetailView, setSelectedRecipeForDetailView] = useState<Recipe | null>(null);
  const [progressEntries, setProgressEntries] = useState<WeightEntry[]>([]);

  // Recipe-Driven Meal Plan State
  const [numberOfMealsInRecipePlan, setNumberOfMealsInRecipePlan] = useState<number>(DEFAULT_NUMBER_OF_MEALS);
  const [activeRecipePlan, setActiveRecipePlan] = useState<PlannedRecipeMeal[] | null>(null);
  const [isSelectRecipeModalOpen, setIsSelectRecipeModalOpen] = useState(false);
  const [targetMealSlotIdForRecipe, setTargetMealSlotIdForRecipe] = useState<string | null>(null);

  // UI State
  const [currentView, setCurrentView] = useState<AppView>('authGate'); 
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // --- App Initialization and User Data Loading ---
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      loadUserData(user.id);
      setCurrentView('userDashboard'); // Default to dashboard if logged in
    } else {
      setCurrentView('authGate'); 
    }
    setAppInitializationDone(true);
  }, []);

  const loadUserData = (userId: string) => {
    const customFoods = DataStorageService.getCustomFoodItems(userId);
    const predefinedWithUserId = PREDEFINED_FOOD_ITEMS.map(item => ({...item, userId: null})); 
    setAllFoodItems([...predefinedWithUserId, ...customFoods]);
    
    setAllRecipes(DataStorageService.getCustomRecipes(userId));
    setProgressEntries(DataStorageService.getWeightEntries(userId));

    // Load calculator state if exists for this user
    const savedCalcData = DataStorageService.getCalculatorState(userId);
    if (savedCalcData) {
        setUserData(savedCalcData.userData);
        setGoalSettings(savedCalcData.goalSettings);
        setSelectedDiet(savedCalcData.selectedDiet);
        setInitialTdee(savedCalcData.initialTdee);
        setFinalTdee(savedCalcData.finalTdee);
        setUserTargetMacros(savedCalcData.userTargetMacros);
        setCarbCycleConfig(savedCalcData.carbCycleConfig);
        setIntermittentFastingConfig(savedCalcData.intermittentFastingConfig);
    } else {
        resetCalculatorStateOnly();
    }
  };

  const clearUserData = () => {
    setAllFoodItems(PREDEFINED_FOOD_ITEMS.map(item => ({...item, userId: null}))); 
    setAllRecipes([]);
    setProgressEntries([]);
    resetCalculatorStateOnly();
    setActiveRecipePlan(null);
    setEditingRecipe(null);
    setSelectedRecipeForDetailView(null);
    if(currentUser) DataStorageService.clearCalculatorState(currentUser.id);
  };
  
  const showTemporaryNotification = (type: 'success' | 'error', message: string, duration: number = 4000) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), duration);
  };

  // --- Authentication Handlers ---
  const handleLogin = async (email: string, password?: string): Promise<{success: boolean; message?: string}> => {
    setIsLoadingAuth(true);
    // Assuming LoginView will always provide a password now since Google Login button is removed from it.
    // If there were other ways to call onLogin without password for Google, those would need specific handling.
    const result = await AuthService.loginUser(email, password); 
    setIsLoadingAuth(false);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      loadUserData(result.user.id);
      setCurrentView('userDashboard'); 
      setAuthView('login'); 
    }
    return {success: result.success, message: result.message};
  };

  const handleRegister = async (email: string, password?: string): Promise<{success: boolean; message?: string}> => {
    setIsLoadingAuth(true);
    const result = await AuthService.registerUser(email, password); // Standard email/password registration
    setIsLoadingAuth(false);
    if (result.success) {
      showTemporaryNotification('success', AUTH_SUCCESS_REGISTER);
      setAuthView('login'); 
    }
    return {success: result.success, message: result.message};
  };

  const handleRegisterWithGoogle = async (email: string): Promise<{success: boolean; message?: string}> => {
    setIsLoadingAuth(true);
    // This function handles new Google user creation or logs in if Google account already exists.
    const result = await AuthService.signInOrRegisterWithGoogleSimulated(email); 
    setIsLoadingAuth(false);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      loadUserData(result.user.id);
      setCurrentView('userDashboard');
      setAuthView('login'); 
    }
    return {success: result.success, message: result.message};
  };


  const handleLogout = () => {
    if(currentUser) DataStorageService.clearCalculatorState(currentUser.id);
    AuthService.logoutUser();
    setCurrentUser(null);
    clearUserData();
    setCurrentView('authGate');
  };


  // --- Food Database Handlers ---
  const handleAddNewFoodItem = (newFoodData: Omit<FoodItem, 'id' | 'isCustom' | 'userId'>): boolean => {
    if (!currentUser) return false;
    const savedItem = DataStorageService.addCustomFoodItem(currentUser.id, newFoodData);
    if (savedItem) {
      setAllFoodItems(prevItems => [...prevItems, savedItem]);
      return true;
    }
    return false;
  };

  // --- Recipe Handlers ---
  const handleSaveRecipe = (recipeData: Omit<Recipe, 'id' | 'isCustom' | 'createdAt' | 'userId'> | Recipe) => {
    if (!currentUser) return;
    let savedRecipe: Recipe | null = null;
    if ('id' in recipeData) { 
        savedRecipe = DataStorageService.updateCustomRecipe(currentUser.id, recipeData as Recipe);
        if (savedRecipe) {
            setAllRecipes(prevRecipes => prevRecipes.map(r => r.id === savedRecipe!.id ? savedRecipe! : r));
            if(activeRecipePlan){
              setActiveRecipePlan(prevPlan => prevPlan?.map(mealSlot => {
                if(mealSlot.recipeSnapshot?.id === savedRecipe!.id){
                  return {
                    ...mealSlot,
                    recipeSnapshot: {
                      id: savedRecipe!.id,
                      name: savedRecipe!.name,
                      perServingMacros: savedRecipe!.perServingMacros,
                      ingredients: savedRecipe!.ingredients,
                      definedServingsInRecipe: savedRecipe!.servings
                    }
                  };
                }
                return mealSlot;
              }) || null);
            }
            if (selectedRecipeForDetailView?.id === savedRecipe.id) {
                setSelectedRecipeForDetailView(savedRecipe);
            }
        }
    } else { 
        savedRecipe = DataStorageService.addCustomRecipe(currentUser.id, recipeData as Omit<Recipe, 'id' | 'isCustom' | 'createdAt' | 'userId'>);
        if (savedRecipe) {
            setAllRecipes(prevRecipes => [...prevRecipes, savedRecipe!]);
        }
    }

    if (savedRecipe) {
      showTemporaryNotification('success', RECIPE_SAVED_SUCCESSFULLY);
      setEditingRecipe(null);
      setCurrentView('recipeList');
    } else {
      showTemporaryNotification('error', ERROR_SAVING_RECIPE);
    }
  };
  
  const handleViewRecipeDetail = (recipeId: string) => {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (recipe) {
      setSelectedRecipeForDetailView(recipe);
      setEditingRecipe(null); 
      setCurrentView('recipeDetail');
    }
  };

  const handleEditRecipeFromDetail = (recipeId: string) => {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (recipe) {
      setEditingRecipe(recipe);
      setSelectedRecipeForDetailView(null); 
      setCurrentView('recipeCreation');
    }
  };
  
  const handleDeleteRecipe = (recipeId: string) => {
    if (!currentUser) return;
    const success = DataStorageService.deleteCustomRecipe(currentUser.id, recipeId);
    if (success) {
      setAllRecipes(prevRecipes => prevRecipes.filter(r => r.id !== recipeId));
       if(activeRecipePlan){
          setActiveRecipePlan(prevPlan => prevPlan?.map(slot => 
            slot.assignedRecipeId === recipeId ? {...slot, assignedRecipeId: null, recipeSnapshot: null, quantityOfRecipeServings: 1} : slot
          ) || null);
       }
      showTemporaryNotification('success', RECIPE_DELETED_SUCCESSFULLY);
      setCurrentView('recipeList'); 
      setSelectedRecipeForDetailView(null);
      setEditingRecipe(null);
    } else {
      showTemporaryNotification('error', ERROR_DELETING_RECIPE);
    }
  };


  // --- Progress Tracking Handlers ---
  const handleAddProgressEntry = async (entryData: Omit<WeightEntry, 'id' | 'userId'>): Promise<boolean> => {
    if (!currentUser) return false;
    const newEntry = DataStorageService.addWeightEntry(currentUser.id, entryData);
    if (newEntry) {
      setProgressEntries(prev => [newEntry, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      showTemporaryNotification('success', ENTRY_SAVED_SUCCESS);
      return true;
    }
    return false;
  };
  const handleDeleteProgressEntry = async (entryId: string): Promise<boolean> => {
    if (!currentUser) return false;
    const success = DataStorageService.deleteWeightEntry(currentUser.id, entryId);
    if (success) {
      setProgressEntries(prev => prev.filter(e => e.id !== entryId));
      return true;
    }
    return false;
  };


  // --- Calculator Flow Handlers ---
  const saveCalculatorStateToLocalStorage = useCallback(() => {
    if (currentUser && userData && goalSettings && initialTdee && finalTdee && userTargetMacros) {
      DataStorageService.saveCalculatorState(currentUser.id, {
        userData,
        goalSettings,
        selectedDiet,
        initialTdee,
        finalTdee,
        userTargetMacros,
        carbCycleConfig,
        intermittentFastingConfig,
      });
    }
  }, [currentUser, userData, goalSettings, selectedDiet, initialTdee, finalTdee, userTargetMacros, carbCycleConfig, intermittentFastingConfig]);


  const handleUserDataSubmit = (data: UserData) => {
    setUserData(data); 
    const bmr = calculateBMR(data);
    const _initialTdee = calculateTDEE(bmr, data.activityLevel); 
    setInitialTdee(_initialTdee); 
    setFinalTdee(_initialTdee); 
    setCurrentView('goalSelection');
  };

  const handleGoalSubmit = (settings: GoalSettings) => {
    setGoalSettings(settings);
    if (initialTdee) {
      const adjustedTdee = calculateAdjustedTDEE(initialTdee, settings.goal, settings.modifier);
      setFinalTdee(adjustedTdee);
    }
    setCurrentView('dietSelection');
  };

  const calculateAndSetUserTargetMacros = useCallback(() => {
    if (finalTdee && userData && goalSettings && selectedDiet) {
      let calculatedMacros;
      if (selectedDiet === DietProtocol.CARB_CYCLING) {
        calculatedMacros = calculateMacros(finalTdee, selectedDiet, goalSettings.goal, userData.weight, 'medium');
      } else {
        calculatedMacros = calculateMacros(finalTdee, selectedDiet, goalSettings.goal, userData.weight);
      }
      setUserTargetMacros(calculatedMacros);
    }
  }, [finalTdee, userData, goalSettings, selectedDiet]);
  
  useEffect(() => {
    if (currentView === 'results') { 
        calculateAndSetUserTargetMacros();
    }
  }, [currentView, calculateAndSetUserTargetMacros]);

  useEffect(() => { 
    if(userTargetMacros && currentUser) {
        saveCalculatorStateToLocalStorage();
    }
  }, [userTargetMacros, saveCalculatorStateToLocalStorage, currentUser]);


  const handleDietSelect = (diet: DietProtocol) => {
    setSelectedDiet(diet);
    setCarbCycleConfig(null);
    setIntermittentFastingConfig(null);

    if (diet === DietProtocol.CARB_CYCLING) {
      setCurrentView('carbCycleSetup');
    } else if (diet === DietProtocol.INTERMITTENT_FASTING) {
      setCurrentView('intermittentFastingSetup');
    } else {
      setCurrentView('results'); 
    }
  };
  
  const handleCarbCycleSubmit = (config: CarbCycleConfig) => {
    setCarbCycleConfig(config);
    setCurrentView('results');
  };

  const handleIFSubmit = (config: IntermittentFastingConfig) => {
    setIntermittentFastingConfig(config);
    setCurrentView('results');
  };

  const resetCalculatorStateOnly = () => { 
    setUserData(null);
    setGoalSettings(null);
    setSelectedDiet(DietProtocol.NONE);
    setInitialTdee(null);
    setFinalTdee(null);
    setUserTargetMacros(null);
    setCarbCycleConfig(null);
    setIntermittentFastingConfig(null);
    setEditingRecipe(null); 
    setSelectedRecipeForDetailView(null);
    if(currentUser) DataStorageService.clearCalculatorState(currentUser.id);
  };

  const resetAppToCalculatorInput = () => { 
    resetCalculatorStateOnly();
    setCurrentView('userInput');
  };
  
  // --- Recipe-Driven Meal Plan Handlers ---
  const initializeActiveRecipePlan = useCallback((numMeals: number) => {
    const newPlan: PlannedRecipeMeal[] = [];
    for (let i = 0; i < numMeals; i++) {
      newPlan.push({
        id: `meal_slot_${new Date().getTime()}_${i}`,
        slotName: `${MEAL_SLOT_NAME_PREFIX} ${i + 1}`,
        assignedRecipeId: null,
        recipeSnapshot: null,
        quantityOfRecipeServings: 1, 
      });
    }
    setActiveRecipePlan(newPlan);
    setNumberOfMealsInRecipePlan(numMeals);
  }, []);

  useEffect(() => {
    if (!activeRecipePlan && numberOfMealsInRecipePlan > 0) {
        initializeActiveRecipePlan(numberOfMealsInRecipePlan);
    }
  }, [numberOfMealsInRecipePlan, activeRecipePlan, initializeActiveRecipePlan]);


  const handleNumberOfMealsChange = (numMeals: number) => {
    setNumberOfMealsInRecipePlan(numMeals);
    initializeActiveRecipePlan(numMeals); 
  };

  const handleOpenSelectRecipeModal = (mealSlotId: string) => {
    setTargetMealSlotIdForRecipe(mealSlotId);
    setIsSelectRecipeModalOpen(true);
  };

  const handleCloseSelectRecipeModal = () => {
    setIsSelectRecipeModalOpen(false);
    setTargetMealSlotIdForRecipe(null);
  };

  const handleAssignRecipeToSlot = (selectedRecipe: Recipe) => {
    if (!targetMealSlotIdForRecipe || !activeRecipePlan) {
      showTemporaryNotification('error', ERROR_LOADING_RECIPE_FOR_PLAN);
      return;
    }
    
    setActiveRecipePlan(prevPlan => 
      prevPlan!.map(slot => 
        slot.id === targetMealSlotIdForRecipe 
        ? { 
            ...slot, 
            assignedRecipeId: selectedRecipe.id,
            recipeSnapshot: {
              id: selectedRecipe.id,
              name: selectedRecipe.name,
              perServingMacros: selectedRecipe.perServingMacros,
              ingredients: selectedRecipe.ingredients,
              definedServingsInRecipe: selectedRecipe.servings,
            },
            quantityOfRecipeServings: 1, 
          } 
        : slot
      )
    );
    handleCloseSelectRecipeModal();
  };
  
  const handleUpdateRecipeServingsInSlot = (mealSlotId: string, newServings: number) => {
    setActiveRecipePlan(prevPlan =>
      prevPlan!.map(slot =>
        slot.id === mealSlotId
        ? { ...slot, quantityOfRecipeServings: Math.max(0.1, newServings) } 
        : slot
      )
    );
  };

  const handleAdjustActivePlanToMacros = () => {
    if (!userTargetMacros) {
      showTemporaryNotification('error', PLAN_ADJUSTMENT_ERROR_NO_TARGET_MACROS);
      return;
    }
    if (!activeRecipePlan || activeRecipePlan.some(slot => !slot.assignedRecipeId || !slot.recipeSnapshot)) {
      showTemporaryNotification('error', PLAN_ADJUSTMENT_ERROR_NO_RECIPES);
      return;
    }

    let currentTotalCaloriesFromPlan = 0;
    activeRecipePlan.forEach(slot => {
      if (slot.recipeSnapshot) {
        currentTotalCaloriesFromPlan += slot.recipeSnapshot.perServingMacros.calories * slot.quantityOfRecipeServings;
      }
    });
    
    if (currentTotalCaloriesFromPlan === 0) {
       const initialPlanCalories = activeRecipePlan.reduce((sum, slot) => {
            return sum + (slot.recipeSnapshot ? slot.recipeSnapshot.perServingMacros.calories * 1 : 0);
       },0);

       if(initialPlanCalories === 0) {
            showTemporaryNotification('error', PLAN_ADJUSTMENT_ERROR_ZERO_CALORIES);
            return;
       }
       currentTotalCaloriesFromPlan = initialPlanCalories; 
    }

    const scalingFactor = userTargetMacros.calories / currentTotalCaloriesFromPlan;

    setActiveRecipePlan(prevPlan => 
      prevPlan!.map(slot => ({
        ...slot,
        quantityOfRecipeServings: slot.quantityOfRecipeServings * scalingFactor,
      }))
    );
    showTemporaryNotification('success', PLAN_ADJUSTED_SUCCESSFULLY);
  };

  // --- Navigation handlers ---
  const navigateTo = (view: AppView) => {
    if (view === 'recipeList' || view === 'recipeCreation' || view === 'recipeDetail') {
        setEditingRecipe(null);
        if (view !== 'recipeDetail') {
            setSelectedRecipeForDetailView(null);
        }
    }
    if (!['userInput', 'goalSelection', 'dietSelection', 'carbCycleSetup', 'intermittentFastingSetup', 'results'].includes(view) && currentUser) {
        saveCalculatorStateToLocalStorage();
    }
    setCurrentView(view);
  }
  
  useEffect(() => {
    if (currentView === 'results' && finalTdee && userData && goalSettings && selectedDiet) {
      calculateAndSetUserTargetMacros();
    }
  }, [finalTdee, selectedDiet, goalSettings, userData, currentView, calculateAndSetUserTargetMacros]);

  // --- Render Logic ---
  const renderAuthViewContent = () => {
    if (authView === 'login') {
      return <LoginView onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} isLoading={isLoadingAuth} />;
    }
    return <RegisterView 
              onRegister={handleRegister} 
              onRegisterWithGoogle={handleRegisterWithGoogle} 
              onSwitchToLogin={() => setAuthView('login')} 
              isLoading={isLoadingAuth} 
            />;
  };

  const renderAppContent = () => {
    if (!currentUser) return renderAuthViewContent(); 

    switch (currentView) {
      case 'userDashboard':
        return <UserDashboardView 
                  currentUser={currentUser}
                  userTargetMacros={userTargetMacros}
                  latestProgressEntry={progressEntries.length > 0 ? progressEntries[0] : null}
                  customFoodItemCount={allFoodItems.filter(item => item.isCustom && item.userId === currentUser.id).length}
                  recipeCount={allRecipes.length}
                  onNavigate={navigateTo}
                />;
      case 'userInput':
        return <UserInputForm onSubmit={handleUserDataSubmit} />;
      case 'goalSelection':
        return <GoalSelector onSubmit={handleGoalSubmit} />;
      case 'dietSelection':
        return (
          <div className="w-full max-w-lg">
            <DietSelector onSelect={handleDietSelect} currentDiet={selectedDiet} />
            <button 
              onClick={() => {
                if (selectedDiet !== DietProtocol.CARB_CYCLING && selectedDiet !== DietProtocol.INTERMITTENT_FASTING) {
                    calculateAndSetUserTargetMacros(); 
                }
                navigateTo('results');
              }}
              className="mt-4 w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary-light focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={ (selectedDiet === DietProtocol.CARB_CYCLING && !carbCycleConfig) || (selectedDiet === DietProtocol.INTERMITTENT_FASTING && !intermittentFastingConfig) || !finalTdee || !userData || !goalSettings}
            >
              عرض النتائج مباشرة
            </button>
          </div>
        );
      case 'carbCycleSetup':
        return <CarbCycleConfigurator onSubmit={handleCarbCycleSubmit} initialConfig={carbCycleConfig || undefined} />;
      case 'intermittentFastingSetup':
        return <IntermittentFastingConfigurator onSubmit={handleIFSubmit} initialConfig={intermittentFastingConfig || undefined}/>;
      case 'results':
        if (finalTdee && userTargetMacros && goalSettings && userData) { 
          return <ResultsDisplay 
                    finalTdee={finalTdee} 
                    macros={userTargetMacros} 
                    diet={selectedDiet} 
                    goalSettings={goalSettings}
                    userDataWeight={userData.weight}
                    carbCycleConfig={carbCycleConfig} 
                    intermittentFastingConfig={intermittentFastingConfig} 
                    onReset={resetAppToCalculatorInput}
                 />;
        }
        return <p className="text-center text-accent">حدث خطأ ما أو أن البيانات غير مكتملة. يرجى <button onClick={resetAppToCalculatorInput} className="underline hover:text-accent-light">البدء من جديد</button>.</p>;
      case 'foodDatabase':
        return <FoodDatabaseView foodItems={allFoodItems} onAddFood={handleAddNewFoodItem} />;
      case 'recipeList':
        return <RecipeListView 
                  recipes={allRecipes} 
                  onNavigateToCreateRecipe={() => { setEditingRecipe(null); navigateTo('recipeCreation');}}
                  onSelectRecipe={handleViewRecipeDetail}
                />;
      case 'recipeCreation':
        return <RecipeCreationView 
                  key={editingRecipe ? editingRecipe.id : 'new-recipe-form'}
                  allFoodItems={allFoodItems} 
                  onSaveRecipe={handleSaveRecipe} 
                  onCancel={() => navigateTo(editingRecipe && selectedRecipeForDetailView ? 'recipeDetail' : 'recipeList')}
                  existingRecipe={editingRecipe}
                />;
      case 'recipeDetail':
        if (selectedRecipeForDetailView) {
          return <RecipeDetailView
                    recipe={selectedRecipeForDetailView}
                    onEdit={handleEditRecipeFromDetail}
                    onDelete={handleDeleteRecipe}
                    onBack={() => navigateTo('recipeList')}
                  />;
        }
        navigateTo('recipeList');
        return <p>{LOADING_MESSAGE}</p>;
      case 'recipeDrivenMealPlan':
        return <RecipeDrivenMealPlanView
                  userTargetMacros={userTargetMacros}
                  activePlan={activeRecipePlan}
                  numberOfMeals={numberOfMealsInRecipePlan}
                  onNumberOfMealsChange={handleNumberOfMealsChange}
                  onOpenSelectRecipeModal={handleOpenSelectRecipeModal}
                  onAdjustPlan={handleAdjustActivePlanToMacros}
                  onUpdateRecipeServings={handleUpdateRecipeServingsInSlot}
                  onResetCalculator={resetAppToCalculatorInput} 
                />;
      case 'progressTracking':
        return currentUser ? <ProgressTrackingView 
                                userId={currentUser.id}
                                userDataForCalc={userData} 
                                entries={progressEntries}
                                onAddEntry={handleAddProgressEntry}
                                onDeleteEntry={handleDeleteProgressEntry}
                             /> : <p>{LOADING_MESSAGE}</p>;
      default: 
        return renderAuthViewContent();
    }
  };
  
  if (!appInitializationDone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-gray-800 flex items-center justify-center">
        <p className="text-xl text-primary">{LOADING_MESSAGE}</p>
      </div>
    );
  }

  const isCalculatorViewActive = ['userInput', 'goalSelection', 'dietSelection', 'carbCycleSetup', 'intermittentFastingSetup', 'results'].includes(currentView);
  const isRecipeViewActive = ['recipeList', 'recipeCreation', 'recipeDetail'].includes(currentView);

  const getLogoInitials = () => {
    return APP_TITLE.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-800 text-textBase flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 selection:bg-primary selection:text-white">
      <div className="bg-card/80 backdrop-blur-md shadow-2xl rounded-xl p-4 sm:p-6 md:p-10 w-full max-w-4xl my-auto">
        <header className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-3 cursor-pointer" onClick={() => currentUser ? navigateTo('userDashboard') : navigateTo('authGate') }>
            {logoLoadError ? (
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gray-700 flex items-center justify-center text-primary-light font-bold text-xl md:text-2xl shadow-sm ring-1 ring-primary/50" aria-label={`${APP_TITLE} logo placeholder`}>
                {getLogoInitials()}
              </div>
            ) : (
              <img 
                src={LOGO_URL} 
                alt={`${APP_TITLE} Logo`} 
                className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover shadow-sm"
                onError={() => {
                  console.warn(`Logo could not be loaded from "${LOGO_URL}". Please ensure '${LOGO_URL}' is in the same directory as index.html, or the path is correct.`);
                  setLogoLoadError(true);
                }}
              />
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-primary">{APP_TITLE}</h1>
          </div>
          {currentUser && (
            <nav className="mt-4 flex flex-wrap justify-center items-center gap-x-3 gap-y-2 sm:gap-x-4">
              {currentView !== 'userDashboard' && (
                  <button onClick={() => navigateTo('userDashboard')} className="text-sm text-primary-light hover:underline hover:text-primary-dark transition-colors">
                      {USER_DASHBOARD_NAV_LINK}
                  </button>
              )}
              {!isCalculatorViewActive && currentView !== 'userDashboard' && (
                  <button onClick={() => navigateTo('userInput')} className="text-sm text-primary-light hover:underline hover:text-primary-dark transition-colors">
                      {MAIN_CALCULATOR_NAV_LINK}
                  </button>
              )}
              {isCalculatorViewActive && currentView !== 'userInput' && (
                  <button onClick={resetAppToCalculatorInput} className="text-sm text-accent hover:underline hover:text-accent-dark transition-colors">
                      {RESET_CALCULATOR_NAV_LINK}
                  </button>
              )}

              {currentView !== 'foodDatabase' && (
                  <button onClick={() => navigateTo('foodDatabase')} className="text-sm text-primary-light hover:underline hover:text-primary-dark transition-colors">
                      {FOOD_DATABASE_NAVIGATION_LINK}
                  </button>
              )}
              {!isRecipeViewActive && (
                 <button onClick={() => navigateTo('recipeList')} className="text-sm text-primary-light hover:underline hover:text-primary-dark transition-colors">
                    {RECIPES_NAVIGATION_LINK}
                 </button>
              )}
              {(currentView === 'recipeCreation' || currentView === 'recipeDetail') && (
                  <button onClick={() => navigateTo('recipeList')} className="text-sm text-primary-light hover:underline hover:text-primary-dark transition-colors">
                      {BACK_TO_RECIPES_BUTTON}
                  </button>
              )}

              {currentView !== 'recipeDrivenMealPlan' && (
                  <button onClick={() => navigateTo('recipeDrivenMealPlan')} className="text-sm text-primary-light hover:underline hover:text-primary-dark transition-colors">
                      {RECIPE_DRIVEN_MEAL_PLAN_NAVIGATION_LINK}
                  </button>
              )}
              {currentView !== 'progressTracking' && (
                  <button onClick={() => navigateTo('progressTracking')} className="text-sm text-primary-light hover:underline hover:text-primary-dark transition-colors">
                      {PROGRESS_TRACKING_NAV_LINK}
                  </button>
              )}
              <button onClick={handleLogout} className="text-sm bg-accent/80 hover:bg-accent text-white py-1 px-3 rounded-md transition-colors shadow">
                {LOGOUT_BUTTON}
              </button>
            </nav>
          )}
        </header>

        {notification && (
          <div className={`my-4 p-3 rounded-md text-center text-sm font-semibold shadow-md ${notification.type === 'success' ? 'bg-secondary/90 text-background' : 'bg-accent/90 text-white'}`}>
            {notification.message}
          </div>
        )}

        <main className="flex flex-col items-center">
          {currentView === 'authGate' ? renderAuthViewContent() : (currentUser ? renderAppContent() : renderAuthViewContent())}
        </main>
      </div>
      {currentUser && isSelectRecipeModalOpen && (
        <SelectRecipeModal
          isOpen={isSelectRecipeModalOpen}
          onClose={handleCloseSelectRecipeModal}
          recipes={allRecipes}
          onSelectRecipe={handleAssignRecipeToSlot}
        />
      )}
       <footer className="text-center mt-8 mb-4 text-sm text-textMuted">
        <p>&copy; {new Date().getFullYear()} {APP_TITLE}. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default App;