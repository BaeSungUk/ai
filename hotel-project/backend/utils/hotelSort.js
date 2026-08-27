export function sortHotelRows(rows, sort) {
  const copy = [...rows];

  if (sort === "ratingDesc") {
    return copy.sort((a, b) => b.rating - a.rating);
  }

  if (sort === "priceAsc" || sort === "priceDesc") {
    return copy.sort((a, b) => {
      if (a.minPrice == null) return 1;
      if (b.minPrice == null) return -1;
      return sort === "priceAsc"
        ? a.minPrice - b.minPrice
        : b.minPrice - a.minPrice;
    });
  }

  return copy;
}
