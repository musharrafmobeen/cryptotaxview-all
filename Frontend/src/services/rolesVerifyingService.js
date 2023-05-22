export const PERMISSION_SLUGS = {
  INTEGRATION_ALL_PERMISSIONS: "INTGVAED",
  REPORTS_ALL_PERMISSIONS: "REPTVAED",
};

export const ROLES = {
  FREE_PERSONAL_USER: "PU",
  PAID_PERSONAL_USER: "PUX",
  PAID_PROFESSIONAL_USER: "PFLUX",
  PAID_PERSONAL_AND_PROFESSIONAL: "",
};

export const isAllowedPermission = (rolePermissionArray, slugToCheck) => {
  for (let i = 0; i < rolePermissionArray.length; i++) {
    if (rolePermissionArray[i].permission.shortCode === slugToCheck)
      return true;
  }
  return false;
};
