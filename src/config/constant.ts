// constants.ts

export const STATUS_CODES = {
  // 1XX INFORMATIONAL
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  EARLY_HINTS: 103,

  // 2XX SUCCESS
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  ALREADY_REPORTED: 208,
  IM_USED: 226,

  // 4XX CLIENT ERROR
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  VALIDATION_ERROR: 422,
  NOT_VALID_DATA: 422,

  // 5XX SERVER ERROR
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
} as const;

export const STATUS = {
  NOTDELETED: 0,
  INACTIVE: 0,
  ACTIVE: 1,
  AVAILABLE: 1,
  NOT_AVAILABLE: 0,
  NOT_WORKING: 0,
  WORKING: 1,
  IN_REPAIRING: 2,
  ASSIGNED: 3,
  PREVIOUS_DEVICE: 0,
  CURRENT_DEVICE: 1,
  DELETED: 1,
  APPROVE: 3,
  REJECTED: 4,
  COMPLETED: 5,
  DEFAULT: 1,
  NOT_DEFAULT: 0,
  TRUE: true,
  FALSE: false,
} as const;

export const ROLE_TYPES = {
  ADMIN: "Admin",
  USER: "User",
} as const;

export const ROLE_TYPES_ID = {
  ADMIN: 1,
  USER: 2,
} as const;

export const STATUSDATA = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export const ORDERSTATUS = {
  INPROGRESS: "Inprogress",
  SHIPPED: "Shipped",
  DELIVERD: "Delivered",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
} as const;

export const PAYMEMENTSTATUS = {
  INPROGRESS: "Inprogress",
  SUCCESS: "Success",
  FAILED: "Failed",
  REFUNDED: "Refunded",
} as const;

export const PAYMENTMETHOD = {
  ONLINE: "Online",
  COD: "COD",
};

export const USERSTATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};
