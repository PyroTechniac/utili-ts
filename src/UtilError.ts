class UtilError extends Error {
    public static readonly default: typeof UtilError = UtilError

    public constructor(message?: string, name: string = 'UtilError') {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = name;
        this.message = message || '';
    }
}

export = UtilError as typeof UtilError & {
    default: typeof UtilError;
}