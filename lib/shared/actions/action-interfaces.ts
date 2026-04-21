export interface ActionResult<T = any> {
    success: boolean;
    message: string;
    data?: T;
}
