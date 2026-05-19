import { useEffect, useState } from "react";
import Filtermaps from "./filtermaps";

const keys = [
  { id: "key_1", name: "Ключ №1" },
  { id: "key_2", name: "Ключ №2" },
  { id: "key_3", name: "Ключ №3" },
];

const selects = [
  { id: "Select_1", name: "select №1" },
  { id: "Select_2", name: "select №2" },
];

const filterTypes = ["range", "exist_key", "where", "from_to", "should"];
// const filterTypess = ["range", "exist_key", "where", "from_to", "should"];

type Condition = {
  inValues: string[];
};

type Filter = {
  id: number;
  type: string;
  conditions: Condition[];
};

const inputClass =
  "h-11 px-4 rounded-2xl border border-gray-300 bg-white outline-none text-sm ";

const FilterBuilder = () => {
  const [filters, setFilters] = useState<Filter[]>(() => {
    const saved = localStorage.getItem("filters");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: Date.now(),
            type: "",
            conditions: [{ inValues: [""] }],
          },
        ];
  });
  // ]);

  // const [showShouldBox, setShowShouldBox] = useState(true);

  const [shouldFilters, setShouldFilters] = useState<Filter[]>(() => {
    const saved = localStorage.getItem("shouldFilters");
    return saved ? JSON.parse(saved) : [];
  });

  const addFilter = () => {
    setFilters((prev) => [
      ...prev,  
      {
        id: Date.now() + Math.random(),
        type: "",
        conditions: [{ inValues: [""] }],
      },
    ]);
  };

  const saveFilters = () => {
    localStorage.setItem("filters", JSON.stringify(filters));

    console.log(JSON.stringify(filters, null, 2));
  };
  const removeFilter = (filterId: number) => {
    setFilters((prev) => prev.filter((filter) => filter.id !== filterId));
  };

  const addCondition = (filterId: number) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions: [...filter.conditions, { inValues: [""] }],
            }
          : filter,
      ),
    );
  };

  const removeCondition = (filterId: number, conditionIndex: number) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions: filter.conditions.filter(
                (_, i) => i !== conditionIndex,
              ),
            }
          : filter,
      ),
    );
  };

  

  const changeType = (id: number, value: string) => {
    setFilters((prev) =>
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

  const addInValue = (filterId: number, conditionIndex: number) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions: filter.conditions.map((condition, i) =>
                i === conditionIndex
                  ? {
                      ...condition,
                      inValues: [...condition.inValues, ""],
                    }
                  : condition,
              ),
            }
          : filter,
      ),
    );
  };

  const removeInValue = (
    filterId: number,
    conditionIndex: number,
    valueIndex: number,
  ) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions: filter.conditions.map((condition, i) =>
                i === conditionIndex
                  ? {
                      ...condition,
                      inValues: condition.inValues.filter(
                        (_, vi) => vi !== valueIndex,
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
    <div className="min-h-screen bg-[#f3f4f6] p-6">
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        {filters.map((filter, fi) => (
          <div
            key={filter.id}
            className="flex flex-col gap-5 border border-gray-200 bg-[#fafafa] p-6 rounded-3xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 ">filter {fi + 1}</span>

              <select
                value={filter.type}
                onChange={(e) => changeType(filter.id, e.target.value)}
                className={`${inputClass} w-52`}
              >
                {filterTypes
                  .filter(
                    (type) =>
                      !filters.some(
                        (f) => f.type === type && f.id !== filter.id,
                      ),
                  )
                  .map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>

              <button
                onClick={() => removeFilter(filter.id)}
                className="ml-auto h-11 w-11 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
              >
                ×
              </button>
            </div>

            {filter.conditions.map((condition, ci) => {
              if (!filter.type) return null;

              return (
                <div key={ci} className="flex flex-col gap-4">
                  {["range", "where", "from_to"].includes(filter.type) && (
                    <select className={`${inputClass} w-56`}>
                      {keys.map((key) => (
                        <option key={key.id} value={key.id}>
                          {key.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {filter.type === "range" && (
                    <div className="flex flex-wrap items-center gap-3">
                      <select className={`${inputClass} w-24`}>
                        <option>gte</option>
                        <option>gt</option>
                      </select>

                      <input
                        type="text"
                        placeholder="value"
                        className={`${inputClass} w-56`}
                      />

                      <select className={`${inputClass} w-24`}>
                        <option>lte</option>
                        <option>lt</option>
                      </select>

                      <input
                        type="text"
                        placeholder="value"
                        className={`${inputClass} w-56`}
                      />
                    </div>
                  )}

                  {filter.type === "exist_key" && (
                    <select className={`${inputClass} w-56`}>
                      {selects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {filter.type === "where" && (
                    <div className="flex flex-col gap-3">
                      {condition.inValues.map((_, valueIndex) => (
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
                              removeInValue(filter.id, ci, valueIndex)
                            }
                            className="h-11 px-4 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                          >
                            - in
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => addInValue(filter.id, ci)}
                        className="h-11 px-5 rounded-2xl bg-black text-white text-sm "
                      >
                        + in
                      </button>
                    </div>
                  )}

                  {filter.type === "from_to" && (
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="from"
                        className={`${inputClass} w-40`}
                      />
                      <input
                        type="number"
                        placeholder="to"
                        className={`${inputClass} w-40`}
                      />
                    </div>
                  )}
                  {filter.type === "should" && (
                    <div className="flex flex-col gap-4">
                      <Filtermaps />
                    </div>
                  )}

                  <button
                    onClick={() => removeCondition(filter.id, ci)}
                    className="h-11 w-11 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                  >
                    −
                  </button>
                </div>
              );
            })}

            {filter.type && (
              <button
                onClick={() => addCondition(filter.id)}
                className="h-11 w-11 rounded-2xl bg-black text-white text-xl flex items-center justify-center "
              >
                +
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addFilter}
          className="h-11 px-6 rounded-2xl bg-black text-white text-sm hover:opacity-90 transition w-fit"
        >
          + Добавить команду
        </button>
        <button
          onClick={saveFilters}
          className="h-11 px-6 rounded-2xl bg-black text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default FilterBuilder;
