import { DietProtocol, ActivityLevel, Gender, Goal, FoodItem } from './types';

export const APP_TITLE = "FITNESS RASHIK"; // Updated title
// Ensure 'rashik.png' is in the same directory as your index.html file.
export const LOGO_URL = "rashik.png"; // Updated path to be relative

// --- AUTHENTICATION CONSTANTS ---
export const LOGIN_TITLE = "تسجيل الدخول";
export const REGISTER_TITLE = "إنشاء حساب جديد";
export const EMAIL_LABEL = "البريد الإلكتروني";
export const PASSWORD_LABEL = "كلمة المرور";
export const CONFIRM_PASSWORD_LABEL = "تأكيد كلمة المرور";
export const LOGIN_BUTTON = "تسجيل الدخول";
// export const LOGIN_WITH_GOOGLE_BUTTON = "تسجيل الدخول بحساب جوجل"; // Removed
export const REGISTER_BUTTON = "إنشاء حساب";
export const REGISTER_WITH_GOOGLE_BUTTON = "التسجيل بحساب جوجل"; 
export const LOGOUT_BUTTON = "تسجيل الخروج";
export const NO_ACCOUNT_PROMPT = "ليس لديك حساب؟";
export const ALREADY_HAVE_ACCOUNT_PROMPT = "لديك حساب بالفعل؟";
export const SIGN_UP_LINK = "سجل الآن";
export const LOGIN_LINK = "سجل الدخول";
export const AUTH_ERROR_HEADER = "خطأ في المصادقة";
export const PASSWORD_MISMATCH_ERROR = "كلمتا المرور غير متطابقتين.";
export const USER_ALREADY_EXISTS_ERROR = "هذا البريد الإلكتروني مسجل بالفعل.";
export const INVALID_CREDENTIALS_ERROR = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
export const AUTH_SUCCESS_REGISTER = "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.";
// export const GOOGLE_LOGIN_PROMPT = "أدخل بريدك الإلكتروني المستخدم في جوجل للمتابعة (محاكاة)."; // Removed
export const GOOGLE_REGISTRATION_EMAIL_PROMPT = "أدخل بريدك الإلكتروني المستخدم في جوجل للتسجيل (محاكاة)."; 
export const ACCOUNT_IS_GOOGLE_LOGIN_ERROR = "ACCOUNT_IS_GOOGLE_LOGIN_ERROR"; // Error key
export const ACCOUNT_IS_EMAIL_PASSWORD_ERROR = "ACCOUNT_IS_EMAIL_PASSWORD_ERROR"; // Error key
export const GOOGLE_REGISTER_EMAIL_ALREADY_STD_ACCOUNT_ERROR = "هذا البريد الإلكتروني مسجل بالفعل لحساب عادي. لا يمكن استخدامه للتسجيل عبر جوجل.";
export const GOOGLE_USER_NOT_FOUND_ERROR = "GOOGLE_USER_NOT_FOUND_ERROR"; 
export const GOOGLE_USER_NOT_FOUND_DISPLAY_MESSAGE = "هذا الحساب غير مسجل كحساب جوجل. يرجى التسجيل أولاً باستخدام جوجل أو تسجيل الدخول بحساب عادي إذا كان لديك واحد.";


// --- USER DASHBOARD CONSTANTS ---
export const USER_DASHBOARD_NAV_LINK = "لوحة التحكم";
export const USER_DASHBOARD_TITLE = "مرحباً بك في لوحة التحكم";
export const WELCOME_MESSAGE_PREFIX = "مرحباً بك، ";
export const DAILY_NEEDS_TITLE_DASHBOARD = "احتياجاتك اليومية المقدرة:";
export const RECALCULATE_NEEDS_BUTTON = "إعادة حساب احتياجاتك";
export const CALCULATE_NEEDS_PROMPT_DASHBOARD = "لم تقم بحساب احتياجاتك من السعرات الحرارية بعد.";
export const START_CALCULATION_BUTTON = "ابدأ حساب السعرات";
export const PROGRESS_SUMMARY_TITLE = "ملخص التقدم";
export const LATEST_ENTRY_LABEL = "آخر تسجيل:"
export const VIEW_ALL_PROGRESS_BUTTON = "عرض كل سجلات التقدم";
export const NO_PROGRESS_LOGGED_DASHBOARD = "لم تسجل أي تقدم بعد.";
export const LOG_FIRST_PROGRESS_BUTTON = "سجل تقدمك الآن";
export const MY_DATA_TITLE = "بياناتي السريعة:";
export const MY_FOODS_LINK_PREFIX = "أطعمتي المخصصة:";
export const MY_RECIPES_LINK_PREFIX = "وصفاتي:";
export const ITEM_UNIT_SINGULAR = "عنصر";
export const ITEM_UNIT_PLURAL = "عناصر";
export const RECIPE_UNIT_SINGULAR = "وصفة";
export const RECIPE_UNIT_PLURAL = "وصفات";
export const NO_WEIGHT_LOGGED = "لا يوجد تسجيل وزن";
export const QUICK_LINKS_TITLE = "روابط سريعة:"


// --- PROGRESS TRACKING & BODY FAT CONSTANTS ---
export const PROGRESS_TRACKING_NAV_LINK = "متابعة التقدم";
export const PROGRESS_TRACKING_TITLE = "متابعة الوزن والمقاسات";
export const ADD_NEW_ENTRY_BUTTON = "إضافة قراءة جديدة";
export const LOG_MEASUREMENTS_BUTTON = "تسجيل القياسات";
export const DATE_LABEL = "التاريخ";
export const WEIGHT_KG_LABEL = "الوزن (كجم)";
export const NECK_CM_LABEL = "محيط الرقبة (سم)";
export const WAIST_CM_LABEL = "محيط الخصر (سم، عند السرة)";
export const HIPS_CM_LABEL = "محيط الحوض (سم، للنساء)";
export const THIGH_CM_LABEL = "محيط الفخذ (سم، اختياري)";
export const BODY_FAT_PERCENTAGE_LABEL = "نسبة الدهون (%)";
export const BODY_FAT_MASS_LABEL = "كتلة الدهون (كجم)";
export const LEAN_BODY_MASS_LABEL = "كتلة الجسم النحيل (كجم)";
export const BODY_FAT_CATEGORY_LABEL = "فئة نسبة الدهون";
export const CALCULATE_BODY_FAT_BUTTON = "حساب نسبة الدهون (US Navy)";
export const HISTORICAL_ENTRIES_TITLE = "السجلات السابقة";
export const NO_PROGRESS_ENTRIES_YET = "لم تقم بتسجيل أي قراءات بعد.";
export const ENTRY_SAVED_SUCCESS = "تم حفظ القراءة بنجاح!";
export const BODY_FAT_INPUTS_REQUIRED = "يرجى إدخال المقاسات المطلوبة (الرقبة، الخصر، والحوض للنساء) بشكل صحيح لحساب نسبة الدهون.";
export const NAVY_BF_INSTRUCTIONS = "لحساب نسبة الدهون، يرجى التأكد من أن طولك وجنسك مُسجلان بشكل صحيح في حاسبة السعرات الحرارية الرئيسية (سيتم استخدامهما تلقائيًا هنا). ثم قم بإدخال مقاسات الرقبة والخصر (والحوض إذا كنتِ أنثى) أدناه.";
export const USED_HEIGHT_LABEL = "الطول المستخدم (من ملفك الشخصي)";
export const USED_GENDER_LABEL = "الجنس المستخدم (من ملفك الشخصي)";
export const BF_CALCULATION_ERROR_MESSAGE = "خطأ في حساب نسبة الدهون. يرجى التحقق من أن المقاسات المدخلة منطقية (مثال: محيط الخصر أكبر من محيط الرقبة للرجال) أو التأكد من إدخال طول وجنس صحيحين في الحاسبة الرئيسية.";
export const HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE = "الطول والجنس من الحاسبة الرئيسية مطلوبان، بالإضافة إلى مقاسات الرقبة والخصر (والحوض للنساء)، لحساب نسبة الدهون.";


export const BODY_FAT_CATEGORIES_MALE: { [key: string]: { min: number, max: number, label: string } } = {
  ESSENTIAL: { min: 2, max: 5, label: "دهون أساسية" },
  ATHLETES: { min: 6, max: 13, label: "رياضيون" },
  FITNESS: { min: 14, max: 17, label: "لياقة بدنية" },
  AVERAGE: { min: 18, max: 24, label: "متوسط" },
  OBESE: { min: 25, max: Infinity, label: "سمنة" },
};

export const BODY_FAT_CATEGORIES_FEMALE: { [key: string]: { min: number, max: number, label: string } } = {
  ESSENTIAL: { min: 10, max: 13, label: "دهون أساسية" },
  ATHLETES: { min: 14, max: 20, label: "رياضيون" },
  FITNESS: { min: 21, max: 24, label: "لياقة بدنية" },
  AVERAGE: { min: 25, max: 31, label: "متوسط" },
  OBESE: { min: 32, max: Infinity, label: "سمنة" },
};


// General UI
export const LOADING_MESSAGE = "جاري التحميل...";
export const REQUIRED_FIELD_ERROR = "هذا الحقل مطلوب.";
export const POSITIVE_NUMBER_ERROR = "القيمة يجب أن تكون رقمًا موجبًا.";
export const NUMBER_INPUT_ERROR = "الرجاء إدخال رقم صحيح.";
export const MAIN_CALCULATOR_NAV_LINK = "حاسبة السعرات";
export const RESET_CALCULATOR_NAV_LINK = "إعادة حساب السعرات";

// Existing constants (copied and potentially merged/modified later if needed)
export const GENDER_OPTIONS = [
  { label: 'ذكر', value: Gender.MALE },
  { label: 'أنثى', value: Gender.FEMALE },
];

export const ACTIVITY_LEVEL_OPTIONS = [
  { label: 'جالس (عمل مكتبي، بدون رياضة)', value: ActivityLevel.SEDENTARY },
  { label: 'نشاط خفيف (رياضة خفيفة 1-3 أيام/أسبوع)', value: ActivityLevel.LIGHT },
  { label: 'نشاط معتدل (رياضة متوسطة 3-5 أيام/أسبوع)', value: ActivityLevel.MODERATE },
  { label: 'نشاط عالي (رياضة مكثفة 6-7 أيام/أسبوع)', value: ActivityLevel.ACTIVE },
  { label: 'نشاط عالي جداً (رياضي محترف أو عمل بدني شاق يومياً)', value: ActivityLevel.VERY_ACTIVE },
];

export const GOAL_OPTIONS = [
  { label: 'خسارة الوزن', value: Goal.LOSE_WEIGHT },
  { label: 'الحفاظ على الوزن الحالي', value: Goal.MAINTAIN_WEIGHT },
  { label: 'زيادة الوزن', value: Goal.GAIN_WEIGHT },
];

export const DEFICIT_SURPLUS_OPTIONS = [
  { label: '10%', value: 0.10 },
  { label: '15%', value: 0.15 },
  { label: '20%', value: 0.20 },
];

export const PROTEIN_PER_KG_LOSE_WEIGHT = 1.6;
export const FAT_PER_KG_LOSE_WEIGHT = 1.0;
export const PROTEIN_PER_KG_GAIN_WEIGHT = 1.6; 
export const FAT_PER_KG_GAIN_WEIGHT = 1.0;  

export const DIET_PROTOCOL_OPTIONS = [
  { label: 'لا أتبع نظام محدد / متوازن', value: DietProtocol.NONE },
  { label: 'نظام الكيتو (Ketogenic Diet)', value: DietProtocol.KETO },
  { label: 'نظام تدوير الكربوهيدرات (Carb Cycling)', value: DietProtocol.CARB_CYCLING },
  { label: 'نظام الصيام المتقطع (Intermittent Fasting 16/8)', value: DietProtocol.INTERMITTENT_FASTING },
];

export const MACRO_DISTRIBUTIONS = {
  [DietProtocol.KETO]: { carbs: 0.05, protein: 0.25, fat: 0.70 }, 
  CARB_CYCLING_HIGH: { carbs: 0.55, protein: 0.25, fat: 0.20 }, 
  CARB_CYCLING_MEDIUM: { carbs: 0.35, protein: 0.30, fat: 0.35 }, 
  CARB_CYCLING_LOW: { carbs: 0.15, protein: 0.40, fat: 0.45 },   
  BALANCED: { carbs: 0.40, protein: 0.30, fat: 0.30 }, 
};

export const GRAMS_PER_CALORIE = {
  protein: 4,
  carbs: 4,
  fat: 9,
};

export const KETO_CARB_LIMIT_GRAMS = 50;

export const ADVICE_TEXTS = {
  [DietProtocol.KETO]: {
    title: "نصائح لنظام الكيتو",
    general: [
      `حافظ على صافي الكربوهيدرات أقل من ${KETO_CARB_LIMIT_GRAMS} جرام يوميًا (البعض يفضل أقل من 20-30 جرام).`,
      "ركز على الدهون الصحية: الأفوكادو، زيت الزيتون، زيت جوز الهند، المكسرات (باعتدال)، البذور.",
      "تناول كمية معتدلة من البروتين: اللحوم، الدواجن، الأسماك، البيض.",
      "اختر الخضروات منخفضة الكربوهيدرات: الخضروات الورقية (سبانخ، خس)، البروكلي، القرنبيط، الكوسا.",
      "تجنب السكريات والنشويات: الخبز، الأرز، المعكرونة، البطاطس، الفواكه عالية السكر.",
      "اشرب الكثير من الماء وحافظ على توازن الأملاح (الصوديوم، البوتاسيوم، المغنيسيوم).",
    ],
    carbWarning: (carbs: number) => `تنبيه: كمية الكربوهيدرات (${carbs.toFixed(0)} جم) قد تتجاوز الحد الموصى به لنظام الكيتو الصارم (عادة < ${KETO_CARB_LIMIT_GRAMS} جم). حاول تقليلها إذا كنت تتبع كيتو صارم.`,
  },
  [DietProtocol.CARB_CYCLING]: {
    title: "نصائح لنظام تدوير الكربوهيدرات",
    general: [
      "خطط لأيامك مسبقًا لضمان التزامك بالماكروز المحددة لكل نوع من الأيام (عالي، متوسط، منخفض الكربوهيدرات).",
      "في أيام الكربوهيدرات المرتفعة، ركز على الكربوهيدرات المعقدة مثل البطاطا الحلوة، الشوفان، الأرز البني.",
      "في أيام الكربوهيدرات المنخفضة، زد من تناول البروتين والدهون الصحية للحفاظ على الشبع والطاقة.",
      "استمع إلى جسدك واضبط الجدول حسب استجابتك ومستوى نشاطك.",
      "يمكن مزامنة أيام الكربوهيدرات المرتفعة مع أيام التمرينات الشاقة.",
    ],
  },
  [DietProtocol.INTERMITTENT_FASTING]: {
    title: "نصائح لنظام الصيام المتقطع (16/8)",
    general: (start: string, end: string) => [
      `نافذة الأكل الخاصة بك هي من ${start} إلى ${end}. تناول جميع وجباتك خلال هذه الفترة.`,
      "خلال فترة الصيام (خارج نافذة الأكل)، يمكنك شرب الماء، القهوة السوداء، أو الشاي غير المحلى.",
      "خطط لوجبات متوازنة ومغذية ضمن نافذة الأكل لضمان حصولك على جميع العناصر الغذائية الضرورية.",
      "ابدأ تدريجيًا إذا كنت جديدًا على الصيام المتقطع.",
      "اشرب كمية كافية من الماء طوال اليوم، خاصة خلال فترة الصيام.",
    ],
  },
   [DietProtocol.NONE]: {
    title: "نصائح عامة لنظام غذائي متوازن",
    general: [
      "ركز على الأطعمة الكاملة وغير المصنعة.",
      "تناول مجموعة متنوعة من الفواكه والخضروات يوميًا.",
      "اختر مصادر البروتين الخالية من الدهون أو قليلة الدهون.",
      "اشمل الدهون الصحية في نظامك الغذائي مثل تلك الموجودة في الأفوكادو والمكسرات وزيت الزيتون.",
      "تحكم في أحجام الحصص لتجنب الإفراط في تناول الطعام.",
      "اشرب كمية كافية من الماء.",
    ]
  }
};

export const PREDEFINED_FOOD_ITEMS: Omit<FoodItem, 'userId'>[] = [
  { id: 'pf1', name: 'صدر دجاج بدون جلد (مشوي/مسلوق)', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100 جرام', isCustom: false },
  { id: 'pf2', name: 'لحم بقري قليل الدهن (ستيك)', calories: 176, protein: 26, carbs: 0, fat: 7, servingSize: '100 جرام', isCustom: false },
  { id: 'pf3', name: 'سمك سلمون (مشوي)', calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: '100 جرام', isCustom: false },
  { id: 'pf4', name: 'بيض (مسلوق)', calories: 78, protein: 6, carbs: 0.6, fat: 5, servingSize: 'بيضة كبيرة (50 جرام)', isCustom: false },
  { id: 'pf5', name: 'زبادي يوناني عادي (قليل الدسم)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSize: '100 جرام', isCustom: false },
  { id: 'pf6', name: 'جبنة قريش', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, servingSize: '100 جرام', isCustom: false },
  { id: 'pf7', name: 'حليب قليل الدسم (1%)', calories: 42, protein: 3.4, carbs: 5, fat: 1, servingSize: '100 مل', isCustom: false },
  { id: 'pf8', name: 'أرز أبيض (مطبوخ)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, servingSize: '100 جرام', isCustom: false },
  { id: 'pf9', name: 'شوفان (جاف)', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, servingSize: '100 جرام', isCustom: false },
  { id: 'pf10', name: 'عدس (مطبوخ)', calories: 116, protein: 9, carbs: 20, fat: 0.4, servingSize: '100 جرام', isCustom: false },
  { id: 'pf11', name: 'خبز أسمر (شريحة)', calories: 70, protein: 3, carbs: 12, fat: 1, servingSize: 'شريحة (25 جرام)', isCustom: false },
  { id: 'pf12', name: 'بروكلي (مطبوخ)', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, servingSize: '100 جرام', isCustom: false },
  { id: 'pf13', name: 'سبانخ (طازجة)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: '100 جرام', isCustom: false },
  { id: 'pf14', name: 'بطاطا حلوة (مخبوزة)', calories: 90, protein: 2, carbs: 21, fat: 0.1, servingSize: '100 جرام', isCustom: false },
  { id: 'pf15', name: 'تفاح (متوسطة الحجم)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: '1 تفاحة (182 جرام)', isCustom: false },
  { id: 'pf16', name: 'موز (متوسط الحجم)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: '1 موزة (118 جرام)', isCustom: false },
  { id: 'pf17', name: 'فراولة', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, servingSize: '100 جرام', isCustom: false },
  { id: 'pf18', name: 'زيت زيتون', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: '100 جرام', isCustom: false },
  { id: 'pf19', name: 'لوز (جاف)', calories: 579, protein: 21, carbs: 22, fat: 50, servingSize: '100 جرام', isCustom: false },
  { id: 'pf20', name: 'أفوكادو', calories: 160, protein: 2, carbs: 9, fat: 15, servingSize: '100 جرام', isCustom: false },
];

export const FOOD_DATABASE_TITLE = "قاعدة بيانات الأطعمة";
export const ADD_NEW_FOOD_BUTTON = "إضافة طعام جديد";
export const SEARCH_FOOD_PLACEHOLDER = "ابحث عن طعام...";
export const FOOD_NAME_LABEL = "اسم الطعام";
export const CALORIES_LABEL = "السعرات الحرارية";
export const PROTEIN_LABEL = "البروتين (جرام)";
export const CARBS_LABEL = "الكربوهيدرات (جرام)";
export const FAT_LABEL = "الدهون (جرام)";
export const SERVING_SIZE_LABEL = "وحدة القياس";
export const SERVING_SIZE_PLACEHOLDER = "مثال: 100 جرام، 1 قطعة، 1 كوب";
export const SUBMIT_NEW_FOOD_BUTTON = "إضافة الطعام";
export const CUSTOM_FOOD_BADGE = "مخصص";
export const NO_FOOD_ITEMS_FOUND = "لم يتم العثور على أطعمة تطابق بحثك.";
export const NO_FOOD_ITEMS_YET = "لا توجد أطعمة في قاعدة البيانات حتى الآن. قم بإضافة بعض الأطعمة!";
export const ERROR_SAVING_FOOD = "حدث خطأ أثناء حفظ الطعام. يرجى المحاولة مرة أخرى.";
export const LABEL_PER_SERVING = "(لوحدة القياس المحددة)";
export const CONFIRM_BUTTON = "تأكيد";
export const CANCEL_BUTTON = "إلغاء";
export const EDIT_FOOD_BUTTON = "تعديل"; 
export const DELETE_FOOD_BUTTON = "حذف"; 
export const FOOD_DATABASE_NAVIGATION_LINK = "قاعدة بيانات الأطعمة";

// --- RECIPE CONSTANTS ---
export const RECIPES_NAVIGATION_LINK = "الوصفات";
export const RECIPE_LIST_TITLE = "قائمة الوصفات";
export const CREATE_NEW_RECIPE_BUTTON = "إنشاء وصفة جديدة";
export const ADD_RECIPE_TITLE = "إضافة وصفة جديدة";
export const EDIT_RECIPE_TITLE = "تعديل الوصفة";
export const RECIPE_NAME_LABEL = "اسم الوصفة";
export const RECIPE_DESCRIPTION_LABEL = "وصف مختصر للوصفة (اختياري)";

// Image Upload Constants for Recipes
export const RECIPE_IMAGE_LABEL = "صورة الوصفة";
export const UPLOAD_IMAGE_BUTTON = "تحميل صورة";
export const CHANGE_IMAGE_BUTTON = "تغيير الصورة";
export const REMOVE_IMAGE_BUTTON = "إزالة الصورة";
export const IMAGE_PREVIEW_ALT = "معاينة صورة الوصفة";
export const IMAGE_UPLOAD_NOTE = "اختر ملف صورة (مثل JPG, PNG). سيتم تغيير حجم الصور الكبيرة.";
export const IMAGE_URL_INPUT_PLACEHOLDER = "أو أدخل رابط صورة خارجي"; // Kept for backward compatibility or dual option
export const ERROR_IMAGE_UPLOAD_SIZE = (sizeMB: number) => `حجم الصورة كبير جدًا (الحد الأقصى ${sizeMB} ميجابايت).`;
export const ERROR_IMAGE_UPLOAD_TYPE = "نوع الملف غير مدعوم. يرجى تحميل صورة (JPG, PNG, GIF, WEBP).";
export const ERROR_IMAGE_LOAD_PREVIEW = "لا يمكن تحميل معاينة الصورة. تأكد من صحة الرابط أو أن الملف صالح.";

export const RECIPE_SERVINGS_LABEL = "عدد الحصص في الوصفة";
export const ADD_INGREDIENT_BUTTON = "إضافة مكون";
export const INGREDIENTS_LABEL = "مكونات الوصفة";
export const INGREDIENT_QUANTITY_GRAM_LABEL = "الكمية (جرام)";
export const TOTAL_RECIPE_MACROS_LABEL = "إجمالي القيم الغذائية للوصفة:";
export const PER_SERVING_MACROS_LABEL = "القيم الغذائية للحصة الواحدة:";
export const SAVE_RECIPE_BUTTON = "حفظ الوصفة";
export const NO_RECIPES_YET = "لم تقم بإضافة أي وصفات بعد. انقر على 'إنشاء وصفة جديدة' للبدء!";
export const NO_RECIPES_FOUND = "لم يتم العثور على وصفات تطابق بحثك.";
export const SELECT_INGREDIENT_PLACEHOLDER = "اختر مكونًا...";
export const ERROR_SAVING_RECIPE = "حدث خطأ أثناء حفظ الوصفة. يرجى المحاولة مرة أخرى.";
export const RECIPE_NAME_REQUIRED = "اسم الوصفة مطلوب.";
export const RECIPE_SERVINGS_POSITIVE = "عدد الحصص يجب أن يكون رقمًا موجبًا وأكبر من صفر.";
export const RECIPE_INGREDIENTS_REQUIRED = "يجب إضافة مكون واحد على الأقل للوصفة.";
export const INGREDIENT_QUANTITY_POSITIVE = "كمية المكون يجب أن تكون رقمًا موجبًا.";
export const DELETE_INGREDIENT_BUTTON_SR = "حذف المكون"; 
export const VIEW_RECIPE_DETAILS_SR = "عرض تفاصيل الوصفة"; 
export const NO_VALID_FOOD_ITEMS_FOR_RECIPE = "لا توجد أطعمة صالحة للإضافة كمكونات (تحتاج إلى حجم حصة بالجرامات قابل للتحليل).";
export const ERROR_FETCHING_INGREDIENT_DETAILS = "خطأ في جلب تفاصيل المكون.";
export const ERROR_INGREDIENT_NO_GRAMS = "لا يمكن استخدام هذا المكون لأنه لا يحتوي على وزن محدد بالجرامات في وحدة قياسه.";
export const RECIPE_SAVED_SUCCESSFULLY = "تم حفظ الوصفة بنجاح!";
export const BACK_TO_RECIPES_BUTTON = "العودة إلى قائمة الوصفات";
export const SEARCH_RECIPES_PLACEHOLDER = "ابحث عن وصفة...";
export const INGREDIENT_FOOD_ITEM_LABEL = "المكون الغذائي";
export const REMOVE_INGREDIENT_LABEL = "إزالة";

// Recipe Detail View Constants
export const RECIPE_DETAIL_TITLE = "تفاصيل الوصفة";
export const EDIT_THIS_RECIPE_BUTTON = "تعديل هذه الوصفة";
export const DELETE_THIS_RECIPE_BUTTON = "حذف هذه الوصفة";
export const CONFIRM_DELETE_RECIPE_MESSAGE = "هل أنت متأكد أنك تريد حذف هذه الوصفة؟ لا يمكن التراجع عن هذا الإجراء.";
export const RECIPE_DELETED_SUCCESSFULLY = "تم حذف الوصفة بنجاح!";
export const ERROR_DELETING_RECIPE = "حدث خطأ أثناء حذف الوصفة.";
export const NO_DESCRIPTION_AVAILABLE = "لا يوجد وصف لهذه الوصفة.";

export const CALORIES_UNIT = "سعر حراري";
export const PROTEIN_UNIT = "جم بروتين";
export const CARBS_UNIT = "جم كربوهيدرات";
export const FAT_UNIT = "جم دهون";

export const MEAL_PLAN_NAVIGATION_LINK_MANUAL = "الخطة الغذائية (يدوي)"; 
export const MEAL_PLAN_TITLE_MANUAL = "خطتك الغذائية اليومية (إدخال يدوي)";
export const EDIT_MEAL_BUTTON = "تعديل"; 
export const MEAL_NAME_LABEL = "اسم الوجبة"; 
export const CURRENT_DAILY_TOTAL_LABEL = "إجمالي اليوم الحالي:"; 
export const TARGET_DAILY_NEEDS_LABEL = "احتياجاتك اليومية (الهدف):"; 
export const DIFFERENCE_FROM_TARGET_LABEL = "الفرق عن الهدف اليومي:"; 
export const SAVE_MEAL_CHANGES_BUTTON = "حفظ التعديلات"; 
export const CREATE_INITIAL_MEAL_PLAN_BUTTON_MANUAL = "إنشاء خطة مبدئية (يدوي)";
export const DEFAULT_MEAL_NAMES: { [key: string]: string } = { 
  breakfast: "فطور",
  lunch: "غداء",
  dinner: "عشاء",
  snack1: "وجبة خفيفة 1",
  snack2: "وجبة خفيفة 2"
};
export const NO_MEAL_PLAN_YET_MANUAL = "لم يتم إنشاء خطة غذائية يدوية بعد.";
export const CALCULATE_NEEDS_FIRST_PROMPT = "يرجى حساب احتياجاتك أولاً من حاسبة السعرات لتتمكن من إنشاء خطة غذائية مخصصة.";
export const MEAL_MACROS_INPUT_ERROR = "قيم السعرات والماكروز يجب أن تكون أرقامًا موجبة."; 
export const EDIT_MEAL_MODAL_TITLE_MANUAL = "تعديل الوجبة (يدوي)";
export const MEAL_NAME_REQUIRED = "اسم الوجبة مطلوب."; 

export const RECIPE_DRIVEN_MEAL_PLAN_NAVIGATION_LINK = "الخطة الغذائية"; // Simplified
export const RECIPE_DRIVEN_MEAL_PLAN_TITLE = "خطتك الغذائية (قائمة على الوصفات)";
export const NUMBER_OF_MEALS_LABEL = "عدد الوجبات في اليوم";
export const DEFAULT_NUMBER_OF_MEALS = 3;
export const MIN_MEALS = 1;
export const MAX_MEALS = 10; 
export const MEAL_SLOT_NAME_PREFIX = "الوجبة";
export const ASSIGN_RECIPE_BUTTON = "اختر وصفة";
export const CHANGE_RECIPE_BUTTON = "تغيير الوصفة";
export const ADJUST_PLAN_TO_MACROS_BUTTON = "تعديل الكميات لتناسب الاحتياج اليومي";
export const PLAN_ADJUSTED_SUCCESSFULLY = "تم تعديل كميات الخطة بنجاح!";
export const PLAN_ADJUSTMENT_ERROR_NO_TARGET_MACROS = "يرجى حساب احتياجاتك اليومية أولاً.";
export const PLAN_ADJUSTMENT_ERROR_NO_RECIPES = "يرجى اختيار وصفات لجميع الوجبات أولاً.";
export const PLAN_ADJUSTMENT_ERROR_ZERO_CALORIES = "لا يمكن تعديل الخطة لأن مجموع سعرات الوصفات المختارة هو صفر. اختر وصفات أخرى.";
export const ADJUSTED_SERVINGS_LABEL = "حصص الوصفة المعدلة";
export const ADJUSTED_INGREDIENTS_LABEL = "المقادير المعدلة لهذه الوجبة:";
export const SELECT_RECIPE_MODAL_TITLE = "اختر وصفة لهذه الوجبة";
export const NO_RECIPES_AVAILABLE_TO_ASSIGN = "لا توجد وصفات محفوظة لإضافتها. قم بإنشاء بعض الوصفات أولاً.";
export const ERROR_LOADING_RECIPE_FOR_PLAN = "خطأ في تحميل تفاصيل الوصفة للخطة.";
export const MEAL_SLOT_SETUP_TITLE = "إعداد وجبات اليوم";
export const PLAN_TOTALS_TITLE = "إجماليات الخطة الحالية";
export const PLAN_DIFFERENCE_TITLE = "الفرق عن احتياجك اليومي";
export const MEAL_NUMBER_INPUT_ERROR = `عدد الوجبات يجب أن يكون بين ${MIN_MEALS} و ${MAX_MEALS}.`;
export const RECIPE_NOT_ASSIGNED = "لم يتم اختيار وصفة";