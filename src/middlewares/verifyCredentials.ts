export const verifyCredentials = (req: any, res: any, next: any) => {
  if (!req.user || !req.user.credentials || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing user information" });
  }

  const userCredentials = req.user.credentials;
  const userId = Number(req.user.id);
  const targetUserIdRaw =
    req.params.userId ?? req.params.id ?? req.body.userId ?? req.query.userId;
  const targetUserId = targetUserIdRaw ? Number(targetUserIdRaw) : undefined;

  if (userCredentials === "admin" || userCredentials === "teacher") {
    return next();
  }

  if (targetUserId !== undefined && userId === targetUserId) {
    return next();
  }

  const getCourseId = () => {
    const raw = req.params.courseId ?? req.body.courseId ?? req.query.courseId;
    return raw ? Number(raw) : undefined;
  };

  const courseId = getCourseId();

  if (userCredentials === "student" && courseId !== undefined) {
    const enrolledCourses = req.user.courses || [];
    if (enrolledCourses.includes(courseId)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Forbidden: Not enrolled in the course" });
  }

  if (
    userCredentials === "student" &&
    req.baseUrl &&
    req.baseUrl.includes("/subscription")
  ) {
    const subCourseIdRaw =
      req.params.courseId ?? req.body.courseId ?? req.query.courseId;
    if (!subCourseIdRaw) {
      return res
        .status(400)
        .json({ message: "Bad Request: Missing courseId parameter" });
    }
    const subCourseId = Number(subCourseIdRaw);
    const enrolledCourses = req.user.courses || [];
    if (enrolledCourses.includes(subCourseId)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Forbidden: Not subscribed to the subscription" });
  }

  return res.status(403).json({ message: "Forbidden: Access denied" });
};
