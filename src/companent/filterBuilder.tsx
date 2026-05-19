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

const filterTypes = [
  "range",
  "exist_key",
  "where",
  "from_to",
  "should",
];

type Condition = {
  key: string;
  gte: string;
  lte: string;
  from: string;
  to: string;
  values: string[];
};

type Filter = {
  id: number;
  type: string;
  conditions: Condition[];
};

const inputClass =
  "h-11 px-4 rounded-2xl border border-gray-300 bg-white outline-none text-sm";

const createCondition = (): Condition => ({
  key: "",
  gte: "",
  lte: "",
  from: "",
  to: "",
  values: [""],
});

const createFilter = (): Filter => ({
  id: Date.now() + Math.random(),
  type: "",
  conditions: [createCondition()],
});

const FilterBuilder = () => {
  const [filters, setFilters] = useState<Filter[]>(() => {
    try {
      const saved = localStorage.getItem("filters");

      if (!saved) {
        return [createFilter()];
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [createFilter()];
      }

      return parsed.map((filter: any) => ({
        id: filter.id || Date.now(),
        type: filter.type || "",
        conditions: Array.isArray(
          filter.conditions,
        )
          ? filter.conditions.map(
              (condition: any) => ({
                key:
                  condition?.key || "",
                gte:
                  condition?.gte || "",
                lte:
                  condition?.lte || "",
                from:
                  condition?.from || "",
                to:
                  condition?.to || "",
                values: Array.isArray(
                  condition?.values,
                )
                  ? condition.values
                  : [""],
              }),
            )
          : [createCondition()],
      }));
    } catch {
      return [createFilter()];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "filters",
      JSON.stringify(filters),
    );
  }, [filters]);

  const addFilter = () => {
    setFilters((prev) => [
      ...prev,
      createFilter(),
    ]);
  };

  const removeFilter = (
    filterId: number,
  ) => {
    setFilters((prev) =>
      prev.filter(
        (filter) =>
          filter.id !== filterId,
      ),
    );
  };

  const changeType = (
    id: number,
    value: string,
  ) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === id
          ? {
              ...filter,
              type: value,
              conditions: [
                createCondition(),
              ],
            }
          : filter,
      ),
    );
  };

  const addCondition = (
    filterId: number,
  ) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions: [
                ...filter.conditions,
                createCondition(),
              ],
            }
          : filter,
      ),
    );
  };

  const removeCondition = (
    filterId: number,
    conditionIndex: number,
  ) => {
    setFilters((prev) =>
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

  const updateCondition = (
    filterId: number,
    conditionIndex: number,
    field: keyof Condition,
    value: string,
  ) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions:
                filter.conditions.map(
                  (
                    condition,
                    i,
                  ) =>
                    i === conditionIndex
                      ? {
                          ...condition,
                          [field]: value,
                        }
                      : condition,
                ),
            }
          : filter,
      ),
    );
  };

  const addInValue = (
    filterId: number,
    conditionIndex: number,
  ) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions:
                filter.conditions.map(
                  (
                    condition,
                    i,
                  ) =>
                    i === conditionIndex
                      ? {
                          ...condition,
                          values: [
                            ...(condition.values ||
                              []),
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
              conditions:
                filter.conditions.map(
                  (
                    condition,
                    i,
                  ) =>
                    i === conditionIndex
                      ? {
                          ...condition,
                          values: (
                            condition.values ||
                            []
                          ).filter(
                            (
                              _,
                              vi,
                            ) =>
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

  const updateInValue = (
    filterId: number,
    conditionIndex: number,
    valueIndex: number,
    value: string,
  ) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              conditions:
                filter.conditions.map(
                  (
                    condition,
                    i,
                  ) =>
                    i === conditionIndex
                      ? {
                          ...condition,
                          values: (
                            condition.values ||
                            []
                          ).map(
                            (
                              v,
                              vi,
                            ) =>
                              vi ===
                              valueIndex
                                ? value
                                : v,
                          ),
                        }
                      : condition,
                ),
            }
          : filter,
      ),
    );
  };

  const saveFilters = () => {
    const json = JSON.stringify(
      filters,
      null,
      2,
    );

    console.log(json);

    localStorage.setItem(
      "filters",
      json,
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
              <span className="text-xs text-gray-400">
                filter {fi + 1}
              </span>

              <select
                value={filter.type}
                onChange={(e) =>
                  changeType(
                    filter.id,
                    e.target.value,
                  )
                }
                className={`${inputClass} w-52`}
              >
                <option value="">
                  select type
                </option>

                {filterTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ),
                )}
              </select>

              <button
                onClick={() =>
                  removeFilter(
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
                  {[
                    "range",
                    "where",
                    "from_to",
                  ].includes(
                    filter.type,
                  ) && (
                    <select
                      value={
                        condition.key
                      }
                      onChange={(e) =>
                        updateCondition(
                          filter.id,
                          ci,
                          "key",
                          e.target
                            .value,
                        )
                      }
                      className={`${inputClass} w-56`}
                    >
                      <option value="">
                        select key
                      </option>

                      {keys.map(
                        (key) => (
                          <option
                            key={
                              key.id
                            }
                            value={
                              key.id
                            }
                          >
                            {
                              key.name
                            }
                          </option>
                        ),
                      )}
                    </select>
                  )}

                  {filter.type ===
                    "range" && (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="gte"
                        value={
                          condition.gte
                        }
                        onChange={(
                          e,
                        ) =>
                          updateCondition(
                            filter.id,
                            ci,
                            "gte",
                            e.target
                              .value,
                          )
                        }
                        className={`${inputClass} w-40`}
                      />

                      <input
                        type="text"
                        placeholder="lte"
                        value={
                          condition.lte
                        }
                        onChange={(
                          e,
                        ) =>
                          updateCondition(
                            filter.id,
                            ci,
                            "lte",
                            e.target
                              .value,
                          )
                        }
                        className={`${inputClass} w-40`}
                      />
                    </div>
                  )}

                  {filter.type ===
                    "exist_key" && (
                    <select
                      className={`${inputClass} w-56`}
                    >
                      {selects.map(
                        (s) => (
                          <option
                            key={
                              s.id
                            }
                            value={
                              s.id
                            }
                          >
                            {
                              s.name
                            }
                          </option>
                        ),
                      )}
                    </select>
                  )}

                  {filter.type ===
                    "where" && (
                    <div className="flex flex-col gap-3">
                      {(condition.values ||
                        []
                      ).map(
                        (
                          value,
                          valueIndex,
                        ) => (
                          <div
                            key={
                              valueIndex
                            }
                            className="flex items-center gap-3"
                          >
                            <input
                              type="text"
                              placeholder="Value"
                              value={
                                value
                              }
                              onChange={(
                                e,
                              ) =>
                                updateInValue(
                                  filter.id,
                                  ci,
                                  valueIndex,
                                  e
                                    .target
                                    .value,
                                )
                              }
                              className={`${inputClass} w-72`}
                            />

                            <button
                              onClick={() =>
                                removeInValue(
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
                          addInValue(
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
                    "from_to" && (
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="from"
                        value={
                          condition.from
                        }
                        onChange={(
                          e,
                        ) =>
                          updateCondition(
                            filter.id,
                            ci,
                            "from",
                            e.target
                              .value,
                          )
                        }
                        className={`${inputClass} w-40`}
                      />

                      <input
                        type="number"
                        placeholder="to"
                        value={
                          condition.to
                        }
                        onChange={(
                          e,
                        ) =>
                          updateCondition(
                            filter.id,
                            ci,
                            "to",
                            e.target
                              .value,
                          )
                        }
                        className={`${inputClass} w-40`}
                      />
                    </div>
                  )}

                  {filter.type ===
                    "should" && (
                    <Filtermaps />
                  )}

                  <button
                    onClick={() =>
                      removeCondition(
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
                  addCondition(
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
          onClick={addFilter}
          className="h-11 px-6 rounded-2xl bg-black text-white"
        >
          + Добавить команду
        </button>

        <button
          onClick={saveFilters}
          className="h-11 px-6 rounded-2xl bg-black text-white"
        >
          Save JSON
        </button>
      </div>
    </div>
  );
};

export default FilterBuilder;