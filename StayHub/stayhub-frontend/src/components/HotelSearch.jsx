function HotelSearch({ filters, setFilters, onSearch, onReset, onSortChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;

    setFilters((prev) => ({
      ...prev,
      sort: value,
    }));

    // 선택 즉시 정렬
    onSortChange(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch();
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <input
        name="region"
        value={filters.region}
        onChange={handleChange}
        placeholder="지역 검색"
      />

      <input
        name="name"
        value={filters.name}
        onChange={handleChange}
        placeholder="호텔명 검색"
      />

      <select name="sort" value={filters.sort} onChange={handleSortChange}>
        <option value="">기본순</option>

        <option value="priceAsc">낮은 가격순</option>

        <option value="priceDesc">높은 가격순</option>

        <option value="ratingDesc">별점 높은순</option>
      </select>

      <button type="submit" className="primary-button">
        검색
      </button>

      <button type="button" className="secondary-button" onClick={onReset}>
        초기화
      </button>
    </form>
  );
}

export default HotelSearch;
