export class HttpError extends Error {
  status: number;
  code?: string;
  details?: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.code = details?.code ?? undefined;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

// Check for known Prisma errors and convert them to HttpError
export function fromPrismaError(err: any): HttpError {
  if (!err || !err.code) {
    return new HttpError(500, err?.message ?? "Prisma error", {
      meta: err?.meta,
    });
  }

  switch (err.code) {
    case "P2002":
      return new HttpError(
        409,
        `Unique constraint failed on ${
          Array.isArray(err?.meta?.target)
            ? err.meta.target.join(", ")
            : err?.meta?.target ?? "field"
        }`,
        { code: err.code, meta: err.meta }
      );
    case "P2025":
      return new HttpError(404, "Resource not found", { code: err.code });
    case "P2003":
      return new HttpError(400, "Foreign key constraint failed", {
        code: err.code,
        meta: err.meta,
      });
    default:
      return new HttpError(500, err?.message ?? "Prisma error", {
        code: err.code,
        meta: err.meta,
      });
  }
}
