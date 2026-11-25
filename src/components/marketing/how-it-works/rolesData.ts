import { userRole } from "./userRole";
import { coachRole } from "./coachRole";
import { adminRole } from "./adminRole";
import { RoleData, Feature, Highlight } from "./types";

export type { RoleData, Feature, Highlight };
export const ROLES: RoleData[] = [userRole, coachRole, adminRole];
