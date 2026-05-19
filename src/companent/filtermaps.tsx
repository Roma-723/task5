import { useEffect, useState } from "react";

export function Filtermaps() {
  // const keys = [
  //   { id: "key_1", name: "Ключ №1" },
  //   { id: "key_2", name: "Ключ №2" },
  //   { id: "key_3", name: "Ключ №3" },
  // ];

  // const selects = [
  //   { id: "Select_1", name: "select №1" },
  //   { id: "Select_2", name: "select №2" },
  // ];

  const filterTypess = [
    "range",
    "exist_key",
    "where",
    "from_to",
    "should",
  ];

  type Condition = {
    inValues: string[];
  };

  type Filter = {
    id: number;
    type: string;
    conditions: Condition[];
  };

  const inputClass =
    "h-11 px-4 rounded-2xl border border-gray-300 bg-white outline-none text-sm focus:border-black transition";

  const [shouldFilters, setShouldFilters] = useState<Filter[]>(() => {
    const saved = localStorage.getItem("shouldFilters");

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "shouldFilters",
      JSON.stringify(shouldFilters),
    );
  }, [shouldFilters]);

  const addShouldFilter = () => {
    setShouldFilters((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        type: "",
        conditions: [{ inValues: [""] }],
      },
    ]);
  };

  const removeShouldFilter = (
    filterId: number,
  ) => {
    setShouldFilters((prev) =>
      prev.filter(
        (filter) =>
          filter.id !== filterId,
      ),
    );
  };

  const changeShouldType = (
    id: number,
    value: string,
  ) => {
    setShouldFilters((prev) =>
      prev.map((filter) =>
        filter.id === id
          ? {
              ...filter,
              type: value,
              conditions: [{ inValues: [""] }],
            }
          : filter,
      ),
    );
  };

  const addShouldCondition = (
    filterId: number,
  ) => {
    setShouldFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions: [
                ...filter.conditions,
                { inValues: [""] },
              ],
            }
          : filter,
      ),
    );
  };

  const removeShouldCondition = (
    filterId: number,
    conditionIndex: number,
  ) => {
    setShouldFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions:
                filter.conditions.filter(
                  (_, i) =>
                    i !== conditionIndex,
                ),
            }
          : filter,
      ),
    );
  };

  const addShouldInValue = (
    filterId: number,
    conditionIndex: number,
  ) => {
    setShouldFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions:
                filter.conditions.map(
                  (condition, i) =>
                    i === conditionIndex
                      ? {
                          ...condition,
                          inValues: [
                            ...condition.inValues,
                            "",
                          ],
                        }
                      : condition,
                ),
            }
          : filter,
      ),
    );
  };

  const removeShouldInValue = (
    filterId: number,
    conditionIndex: number,
    valueIndex: number,
  ) => {
    setShouldFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions:
                filter.conditions.map(
                  (condition, i) =>
                    i === conditionIndex
                      ? {
                          ...condition,
                          inValues:
                            condition.inValues.filter(
                              (_, vi) =>
                                vi !==
                                valueIndex,
                            ),
                        }
                      : condition,
                ),
            }
          : filter,
      ),
    );
  };

  return (
    <div className="w-full rounded-3xl bg-[#f4f4f4] p-4 min-h-30 flex flex-col gap-5">
      {shouldFilters.map((filter, fi) => (
        <div
          key={filter.id}
          className="flex flex-col gap-5 border border-gray-300 bg-white p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              should {fi + 1}
            </span>

            <select
              value={filter.type}
              onChange={(e) =>
                changeShouldType(
                  filter.id,
                  e.target.value,
                )
              }
              className={`${inputClass} w-52`}
            >
              <option value="">
                select type
              </option>

              {filterTypess.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                removeShouldFilter(
                  filter.id,
                )
              }
              className="ml-auto h-11 w-11 rounded-2xl border border-red-200 text-red-500"
            >
              ×
            </button>
          </div>

          {filter.conditions.map(
            (condition, ci) => (
              <div
                key={ci}
                className="flex flex-col gap-4"
              >
                {filter.type ===
                  "where" && (
                  <div className="flex flex-col gap-3">
                    {condition.inValues.map(
                      (
                        _,
                        valueIndex,
                      ) => (
                        <div
                          key={valueIndex}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="text"
                            placeholder="Value"
                            className={`${inputClass} w-72`}
                          />

                          <button
                            onClick={() =>
                              removeShouldInValue(
                                filter.id,
                                ci,
                                valueIndex,
                              )
                            }
                            className="h-11 px-4 rounded-2xl border border-red-200 text-red-500"
                          >
                            - in
                          </button>
                        </div>
                      ),
                    )}

                    <button
                      onClick={() =>
                        addShouldInValue(
                          filter.id,
                          ci,
                        )
                      }
                      className="h-11 px-5 rounded-2xl bg-black text-white"
                    >
                      + in
                    </button>
                  </div>
                )}

                {filter.type ===
                  "should" && (
                  <div className="pl-5 border-l-2 border-sky-400">
                    <Filtermaps />
                  </div>
                )}

                <button
                  onClick={() =>
                    removeShouldCondition(
                      filter.id,
                      ci,
                    )
                  }
                  className="h-11 w-11 rounded-2xl border border-red-200 text-red-500"
                >
                  −
                </button>
              </div>
            ),
          )}

          {filter.type && (
            <button
              onClick={() =>
                addShouldCondition(
                  filter.id,
                )
              }
              className="h-11 w-11 rounded-2xl bg-black text-white text-xl"
            >
              +
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addShouldFilter}
        className="h-11 px-6 rounded-2xl border border-gray-300 bg-white text-sm"
      >
        Добавить should
      </button>
    </div>
  );
}

export default Filtermaps;