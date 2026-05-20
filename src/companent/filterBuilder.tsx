import { useEffect, useState } from "react";

const keys = [
  { id: "key_1", name: "Ключ №1" },
  { id: "key_2", name: "Ключ №2" },
  { id: "key_3", name: "Ключ №3" },
  { id: "key_4", name: "Ключ №4" },
  { id: "key_5", name: "Ключ №5" },
  { id: "key_6", name: "Ключ №6" },
];

const selects = [
  { id: "Select_1", name: "select №1" },
  { id: "Select_2", name: "select №2" },
  { id: "Select_3", name: "select №3" },
  { id: "Select_4", name: "select №4" },
  { id: "Select_5", name: "select №5" },
  { id: "Select_6", name: "select №6" },
];

const filterTypes = [
  "range",
  "exist_key",
  "!exist_key",
  "where",
  "!where",
  "from_to",
  "should",
];

type Condition = {
  key: string;

  gte: string;
  lte: string;

  gt: string;
  lt: string;

  from: string;
  to: string;

  values: string[];
};

type Filter = {
  id: number;

  type: string;

  conditions: Condition[];

  children: Filter[];
};

const inputClass =
  "h-11 px-4 rounded-2xl border border-gray-300 bg-white outline-none text-sm";

const createCondition = (): Condition => ({
  key: "",

  gte: "",
  lte: "",

  gt: "",
  lt: "",

  from: "",
  to: "",

  values: [""],
});

const createFilter = (): Filter => ({
  id: Date.now() + Math.random(),

  type: "",

  conditions: [createCondition()],

  children: [],
});

function buildJson(filters: Filter[]) {
  const result: any = {};

  filters.forEach((filter) => {
    switch (filter.type) {
      case "range":
        result.range = filter.conditions.map(
          (c) => ({
            [c.key]: {
              ...(c.gte && {
                gte: {
                  "": c.gte,
                },
              }),

              ...(c.lte && {
                lte: {
                  "": c.lte,
                },
              }),

              ...(c.gt && {
                gt: {
                  "": c.gt,
                },
              }),

              ...(c.lt && {
                lt: {
                  "": c.lt,
                },
              }),
            },
          }),
        );

        break;

      case "exist_key":
        result.exist_key =
          filter.conditions.flatMap(
            (c) => c.values,
          );

        break;

      case "!exist_key":
        result["!exist_key"] =
          filter.conditions.flatMap(
            (c) => c.values,
          );

        break;

      case "where":
        result.where =
          filter.conditions.map((c) => ({
            [c.key]: c.values,
          }));

        break;

      case "!where":
        result["!where"] =
          filter.conditions.map((c) => ({
            [c.key]: c.values,
          }));

        break;

      case "from_to":
        result.from_to =
          filter.conditions.map((c) => ({
            [c.key]: [c.from, c.to],
          }));

        break;

      case "should":
        result.should = (
          filter.children || []
        ).map((child) =>
          buildJson([child]),
        );

        break;
    }
  });

  return result;
}

type FilterItemProps = {
  filter: Filter;

  rootFilters: Filter[];

  setRootFilters: React.Dispatch<
    React.SetStateAction<Filter[]>
  >;
};

function FilterItem({
  filter,
  rootFilters,
  setRootFilters,
}: FilterItemProps) {
  const updateRecursive = (
    items: Filter[],
    filterId: number,
    callback: (f: Filter) => Filter,
  ): Filter[] => {
    return items.map((item) => {
      if (item.id === filterId) {
        return callback(item);
      }

      return {
        ...item,

        children: updateRecursive(
          item.children || [],
          filterId,
          callback,
        ),
      };
    });
  };

  const removeRecursive = (
    items: Filter[],
    filterId: number,
  ): Filter[] => {
    return items
      .filter(
        (item) =>
          item.id !== filterId,
      )
      .map((item) => ({
        ...item,

        children: removeRecursive(
          item.children || [],
          filterId,
        ),
      }));
  };

  const changeType = (
    filterId: number,
    value: string,
  ) => {
    setRootFilters((prev) =>
      updateRecursive(
        prev,
        filterId,
        (item) => ({
          ...item,

          type: value,

          conditions: [
            createCondition(),
          ],
        }),
      ),
    );
  };

  const addCondition = (
    filterId: number,
  ) => {
    setRootFilters((prev) =>
      updateRecursive(
        prev,
        filterId,
        (item) => ({
          ...item,

          conditions: [
            ...item.conditions,
            createCondition(),
          ],
        }),
      ),
    );
  };

  const removeCondition = (
    filterId: number,
    conditionIndex: number,
  ) => {
    setRootFilters((prev) =>
      updateRecursive(
        prev,
        filterId,
        (item) => ({
          ...item,

          conditions:
            item.conditions.filter(
              (_, i) =>
                i !== conditionIndex,
            ),
        }),
      ),
    );
  };

  const updateCondition = (
    filterId: number,
    conditionIndex: number,
    field: keyof Condition,
    value: string,
  ) => {
    setRootFilters((prev) =>
      updateRecursive(
        prev,
        filterId,
        (item) => ({
          ...item,

          conditions:
            item.conditions.map(
              (
                condition,
                i,
              ) =>
                i === conditionIndex
                  ? {
                      ...condition,

                      [field]:
                        value,
                    }
                  : condition,
            ),
        }),
      ),
    );
  };

  const addValue = (
    filterId: number,
    conditionIndex: number,
  ) => {
    setRootFilters((prev) =>
      updateRecursive(
        prev,
        filterId,
        (item) => ({
          ...item,

          conditions:
            item.conditions.map(
              (
                condition,
                i,
              ) =>
                i === conditionIndex
                  ? {
                      ...condition,

                      values: [
                        ...condition.values,
                        "",
                      ],
                    }
                  : condition,
            ),
        }),
      ),
    );
  };

  const removeValue = (
    filterId: number,
    conditionIndex: number,
    valueIndex: number,
  ) => {
    setRootFilters((prev) =>
      updateRecursive(
        prev,
        filterId,
        (item) => ({
          ...item,

          conditions:
            item.conditions.map(
              (
                condition,
                i,
              ) =>
                i === conditionIndex
                  ? {
                      ...condition,

                      values:
                        condition.values.filter(
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
        }),
      ),
    );
  };

  const updateValue = (
    filterId: number,
    conditionIndex: number,
    valueIndex: number,
    value: string,
  ) => {
    setRootFilters((prev) =>
      updateRecursive(
        prev,
        filterId,
        (item) => ({
          ...item,

          conditions:
            item.conditions.map(
              (
                condition,
                i,
              ) =>
                i === conditionIndex
                  ? {
                      ...condition,

                      values:
                        condition.values.map(
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
        }),
      ),
    );
  };

  const addShouldChild = (
    filterId: number,
  ) => {
    setRootFilters((prev) =>
      updateRecursive(
        prev,
        filterId,
        (item) => ({
          ...item,

          children: [
            ...(item.children || []),

            createFilter(),
          ],
        }),
      ),
    );
  };

  return (
    <div className="flex flex-col gap-5 border border-gray-200 bg-[#fafafa] p-6 rounded-3xl">
      <div className="flex items-center gap-3">
        <select
          value={filter.type}
          onChange={(e) =>
            changeType(
              filter.id,
              e.target.value,
            )
          }
          className={`${inputClass} w-56`}
        >
          <option value="">
            select type
          </option>

          {filterTypes.map((type) => (
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
            setRootFilters((prev) =>
              removeRecursive(
                prev,
                filter.id,
              ),
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
              "!where",
              "from_to",
            ].includes(filter.type) && (
              <select
                value={condition.key}
                onChange={(e) =>
                  updateCondition(
                    filter.id,
                    ci,
                    "key",
                    e.target.value,
                  )
                }
                className={`${inputClass} w-56`}
              >
                <option value="">
                  select key
                </option>

                {keys.map((key) => (
                  <option
                    key={key.id}
                    value={key.id}
                  >
                    {key.name}
                  </option>
                ))}
              </select>
            )}

            {filter.type ===
              "range" && (
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="gte"
                  value={condition.gte}
                  onChange={(e) =>
                    updateCondition(
                      filter.id,
                      ci,
                      "gte",
                      e.target.value,
                    )
                  }
                  className={`${inputClass} w-32`}
                />

                <input
                  type="text"
                  placeholder="lte"
                  value={condition.lte}
                  onChange={(e) =>
                    updateCondition(
                      filter.id,
                      ci,
                      "lte",
                      e.target.value,
                    )
                  }
                  className={`${inputClass} w-32`}
                />

                <input
                  type="text"
                  placeholder="gt"
                  value={condition.gt}
                  onChange={(e) =>
                    updateCondition(
                      filter.id,
                      ci,
                      "gt",
                      e.target.value,
                    )
                  }
                  className={`${inputClass} w-32`}
                />

                <input
                  type="text"
                  placeholder="lt"
                  value={condition.lt}
                  onChange={(e) =>
                    updateCondition(
                      filter.id,
                      ci,
                      "lt",
                      e.target.value,
                    )
                  }
                  className={`${inputClass} w-32`}
                />
              </div>
            )}

            {[
              "exist_key",
              "!exist_key",
            ].includes(filter.type) && (
              <div className="flex flex-col gap-3">
                {condition.values.map(
                  (
                    value,
                    valueIndex,
                  ) => (
                    <div
                      key={valueIndex}
                      className="flex items-center gap-3"
                    >
                      <select
                        value={value}
                        onChange={(e) =>
                          updateValue(
                            filter.id,
                            ci,
                            valueIndex,
                            e.target.value,
                          )
                        }
                        className={`${inputClass} w-56`}
                      >
                        <option value="">
                          select
                        </option>

                        {selects.map((s) => (
                          <option
                            key={s.id}
                            value={s.id}
                          >
                            {s.name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          removeValue(
                            filter.id,
                            ci,
                            valueIndex,
                          )
                        }
                        className="h-11 px-4 rounded-2xl border border-red-200 text-red-500"
                      >
                        -
                      </button>
                    </div>
                  ),
                )}

                <button
                  onClick={() =>
                    addValue(
                      filter.id,
                      ci,
                    )
                  }
                  className="h-11 px-5 rounded-2xl bg-black text-white"
                >
                  + select
                </button>
              </div>
            )}

            {[
              "where",
              "!where",
            ].includes(filter.type) && (
              <div className="flex flex-col gap-3">
                {condition.values.map(
                  (
                    value,
                    valueIndex,
                  ) => (
                    <div
                      key={valueIndex}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="text"
                        placeholder="value"
                        value={value}
                        onChange={(e) =>
                          updateValue(
                            filter.id,
                            ci,
                            valueIndex,
                            e.target.value,
                          )
                        }
                        className={`${inputClass} w-72`}
                      />

                      <button
                        onClick={() =>
                          removeValue(
                            filter.id,
                            ci,
                            valueIndex,
                          )
                        }
                        className="h-11 px-4 rounded-2xl border border-red-200 text-red-500"
                      >
                        -
                      </button>
                    </div>
                  ),
                )}

                <button
                  onClick={() =>
                    addValue(
                      filter.id,
                      ci,
                    )
                  }
                  className="h-11 px-5 rounded-2xl bg-black text-white"
                >
                  + value
                </button>
              </div>
            )}

            {filter.type ===
              "from_to" && (
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="from"
                  value={condition.from}
                  onChange={(e) =>
                    updateCondition(
                      filter.id,
                      ci,
                      "from",
                      e.target.value,
                    )
                  }
                  className={`${inputClass} w-40`}
                />

                <input
                  type="text"
                  placeholder="to"
                  value={condition.to}
                  onChange={(e) =>
                    updateCondition(
                      filter.id,
                      ci,
                      "to",
                      e.target.value,
                    )
                  }
                  className={`${inputClass} w-40`}
                />
              </div>
            )}

            {filter.type ===
              "should" && (
              <div className="pl-5 border-l-2 border-sky-400 flex flex-col gap-5">
                {filter?.children?.map(
                  (child) => (
                    <FilterItem
                      key={child.id}
                      filter={child}
                      rootFilters={
                        rootFilters
                      }
                      setRootFilters={
                        setRootFilters
                      }
                    />
                  ),
                )}

                <button
                  onClick={() =>
                    addShouldChild(
                      filter.id,
                    )
                  }
                  className="h-11 px-5 rounded-2xl bg-black text-white"
                >
                  + should
                </button>
              </div>
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
            addCondition(filter.id)
          }
          className="h-11 w-11 rounded-2xl bg-black text-white text-xl"
        >
          +
        </button>
      )}
    </div>
  );
}

export default function FilterBuilder() {
  const [filters, setFilters] =
    useState<Filter[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            "filters",
          );

        if (!saved) {
          return [createFilter()];
        }

        return JSON.parse(saved);
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

  const saveJson = () => {
    const json =
      buildJson(filters);

    console.log(
      JSON.stringify(json, null, 2),
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-6">
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        {filters.map((filter) => (
          <FilterItem
            key={filter.id}
            filter={filter}
            rootFilters={filters}
            setRootFilters={setFilters}
          />
        ))}

        <button
          onClick={addFilter}
          className="h-11 px-6 rounded-2xl bg-black text-white"
        >
          + Добавить команду
        </button>

        <button
          onClick={saveJson}
          className="h-11 px-6 rounded-2xl bg-blue-600 text-white"
        >
          Save JSON
        </button>
      </div>
    </div>
  );
}














