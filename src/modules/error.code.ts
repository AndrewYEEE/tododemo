export enum ErrorCode {
  MONGODB_ERROR = 'MONGODB_ERROR',
  AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',
  AUTH_INVALID_PASSWORD = 'AUTH_INVALID_PASSWORD',
  AUTH_EXCEED_RETRY_PASSWORD_MAXIMUM = 'AUTH_EXCEED_RETRY_PASSWORD_MAXIMUM',
  GROUP_NOT_FOUND = 'GROUP_NOT_FOUND',
  GROUP_LEVEL_LIMIT_REACH = 'GROUP_LEVEL_LIMIT_REACH',
  GROUP_DELETE_FAIL = 'GROUP_DELETE_FAIL',
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  DEVICE_TYPE_INCORRECT = 'DEVICE_TYPE_INCORRECT',
  SENSOR_NOT_FOUND = 'SENSOR_NOT_FOUND',
  SENSOR_TYPE_UNSUPPORTED = 'SENSOR_TYPE_UNSUPPORTED',
  ELASTIC_SEARCH_STILL_PROCESSING = 'ELASTIC_SEARCH_STILL_PROCESSING',
  ELASTIC_SEARCH_INDEX_NOT_FOUND = 'ELASTIC_SEARCH_INDEX_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTED = 'USER_ALREADY_EXISTED',
  USER_ADMIN_CANNOT_BE_DELETED = 'USER_ADMIN_CANNOT_BE_DELETED',
  USER_NOT_EXISTED_IN_GROUP = 'USER_NOT_EXISTED_IN_GROUP',
  ACCESS_CODE_INVALID = 'ACCESS_CODE_INVALID',
  INPUT_PARAMETERS_INVALID = 'INPUT_PARAMETERS_INVALID',
  INPUT_DEVICES_INVALID = 'INPUT_DEVICES_INVALID',
  CAMERA_ID_NOT_EXIST = 'CAMERA_ID_NOT_EXIST',
  ROLE_TEMPLATE_DUPLICATED = 'ROLE_TEMPLATE_DUPLICATED',
  ROLE_TEMPLATES_LIMIT_REACH = 'ROLE_TEMPLATES_LIMIT_REACH',
  ROLE_TEMPLATE_NOT_FOUND = 'ROLE_TEMPLATE_NOT_FOUND',
  RULE_NAME_DUPLICATED = 'RULE_NAME_DUPLICATED',
  MESSAGE_IS_EMPTY = 'MESSAGE_IS_EMPTY',
  ESIGNAGNE_VALUE_ERROR = 'ESIGNAGNE_VALUE_ERROR',
  ESIGNAGNE_TEMPLATE_EMPTY = 'ESIGNAGNE_TEMPLATE_EMPTY',
  ESIGNAGNE_MEDIAPOOL_EMPTY = 'ESIGNAGNE_MEDIAPOOL_EMPTY',
  ESIGNAGNE_ADDTEMPLATE_INPUT_INVALUE = 'ESIGNAGNE_ADDTEMPLATE_INPUT_INVALUE',
  ESIGNAGNE_ADD_TEMPLATE_FAILE = 'ESIGNAGNE_ADD_TEMPLATE_FAILE',
  ESIGNAGNE_ADD_TEMPLATE_CONTENT_FAILE = 'ESIGNAGNE_ADD_TEMPLATE_CONTENT_FAILE',
  ESIGNAGNE_ADD_TEMPLATE_CONTENT_DETAIL_FAILE = 'ESIGNAGNE_ADD_TEMPLATE_CONTENT_DETAIL_FAILE',
  ESIGNAGNE_ADD_WEATHER_FAILE = 'ESIGNAGNE_ADD_WEATHER_FAILE',
  ESIGNAGNE_ADD_IPCAM_FAILE = 'ESIGNAGNE_ADD_IPCAM_FAILE',
  ESIGNAGNE_ADD_WEBPAGE_FAILE = 'ESIGNAGNE_ADD_WEBPAGE_FAILE',
  ESIGNAGNE_ADD_MEDIA_FAILE = 'ESIGNAGNE_ADD_MEDIA_FAILE',
  ESIGNAGNE_UPDATETEMPLATE_INPUT_INVALUE = 'ESIGNAGNE_UPDATETEMPLATE_INPUT_INVALUE',
  ESIGNAGNE_UPDATETEMPLATECONTENT_INPUT_INVALUE = 'ESIGNAGNE_UPDATETEMPLATECONTENT_INPUT_INVALUE',
  ESIGNAGNE_UPDATETEMPLATE_ID_EMPTY = 'ESIGNAGNE_UPDATETEMPLATE_ID_EMPTY',
  ESIGNAGNE_DELETETEMPLATE_ID_EMPTY = 'ESIGNAGNE_DELETETEMPLATE_ID_EMPTY',
  ESIGNAGNE_TEMPLATE_IS_NOT_EXIST = 'ESIGNAGNE_TEMPLATE_IS_NOT_EXIST',
  ESIGNAGNE_ADDSCHEDULE_INPUT_INVALUE = 'ESIGNAGNE_ADDSCHEDULE_INPUT_INVALUE',
  ESIGNAGNE_UPDATESCHEDULE_INPUT_INVALUE = 'ESIGNAGNE_UPDATESCHEDULE_INPUT_INVALUE',
  ESIGNAGNE_DELETESCHEDULE_INPUT_INVALUE = 'ESIGNAGNE_DELETESCHEDULE_INPUT_INVALUE',
  ESIGNAGNE_ADD_SCHEDULE_FAILE = 'ESIGNAGNE_ADD_SCHEDULE_FAILE',
  ESIGNAGNE_ADD_SCHEDULE_LOGS_FAILE = 'ESIGNAGNE_ADD_SCHEDULE_LOGS_FAILE',
  BUILDING_CREATE_ERROR = 'BUILDING_CREATE_ERROR',
  BUILDING_UPDATE_ERROR = 'BUILDING_UPDATE_ERROR',
  USERTAG_NOT_FOUND = 'USERTAG_NOT_FOUND',
  USERTAG_ALREADY_EXISTED = 'USERTAG_ALREADY_EXISTED',

  // Errors from other services
  CHTIOT_API_ERROR = 'CHTIOT_API_ERROR',
  CMS_API_ERROR = 'CMS_API_ERROR',
  OPENWEATHER_API_ERROR = 'OPENWEATHER_API_ERROR',
  CHT_CAMERA_API_ERROR = 'CHT_CAMERA_API_ERROR',
  RECAPTCHA_TIMEOUT_OR_DUPLICATE = 'RECAPTCHA_TIMEOUT_OR_DUPLICATE',
  RECAPTCHA_INVALID_INPUT_RESPONSE = 'RECAPTCHA_INVALID_INPUT_RESPONSE',
  RECAPTCHA_UNKNOWN_ERROR = 'RECAPTCHA_UNKNOWN_ERROR',
  DEEPFLOW_API_ERROR = 'DEEPFLOW_API_ERROR',

  NAME_DUPLICATED = 'NAME_DUPLICATED',

  CHTWIFIPLUS_API_ERROR = 'CHTWIFIPLUS_API_ERROR',
  CHTWIFIPLUS_DELETE_AD_API_ERROR = 'CHTWIFIPLUS_DELETE_AD_API_ERROR',
  CHTWIFIPLUS_EDIT_AD_API_ERROR = 'CHTWIFIPLUS_EDIT_AD_API_ERROR',
  CHTWIFIPLUS_ADD_AD_API_ERROR = 'CHTWIFIPLUS_ADD_AD_API_ERROR',
  CHTWIFIPLUS_UPDATE_AREA_API_ERROR = 'CHTWIFIPLUS_UPDATE_AREA_API_ERROR',
  CHTWIFIPLUS_ADD_AREA_API_ERROR = 'CHTWIFIPLUS_ADD_AREA_API_ERROR',
}