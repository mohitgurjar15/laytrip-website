
export interface Dashboard {
    user_id?: number;
    user_guid?: string;
    user_name?: string;
    user_full_name?: string;
    user_email?: string;
    plan_name?: string;
    orgs_plan_from?: string;
    orgs_plan_to?: string;
    user_active?: boolean;
    user_blocked_by_dashboard?: boolean;
}
export interface LoadDashboard {
    user_id: number;
    user_guid: string;
    user_name: string;
    user_full_name: string;
    user_email: string;
    plan_name: string;
    orgs_plan_from: string;
    orgs_plan_to: string;
    user_active: boolean;
    user_blocked_by_dashboard: boolean;
}
