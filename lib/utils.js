export const formatPostedDate = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate();
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffInDays =
    (startOfToday - startOfDate) / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) return "Posted Today";
  if (diffInDays === 1) return "Posted Yesterday";
  if (diffInDays === 2) return "Posted day before Yesterday";

  // fallback → 12 Jan 2025
  return `Posted on ${date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
};
