export const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("ko-KR");
};

export const formatDate = (date) => {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
};

export const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) {
    return 0;
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const difference = checkOut.getTime() - checkIn.getTime();

  if (difference <= 0) {
    return 0;
  }

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

export const getErrorMessage = (error) => {
  return (
    error.response?.data?.message || error.message || "오류가 발생했습니다."
  );
};

export const getId = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "object") {
    return value._id;
  }

  return value;
};
