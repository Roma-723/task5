import { useEffect } from "react";

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

export type Filter = {
  id: number;
  type: string;
  conditions: Condition[];
  children: Filter[];
};

type Props = {
  filters: Filter[];
  setFilters: React.Dispatch<
    React.SetStateAction<Filter[]>
  >;
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

export const createFilter =
  (): Filter => ({
    id: Date.now() + Math.random(),
    type: "",
    conditions: [createCondition()],
    children: [],
  });

function FilterItem({
  filter,
  rootFilters,
  setRootFilters,
}: {
  filter: Filter;
  rootFilters: Filter[];
  setRootFilters: React.Dispatch<
    React.SetStateAction<Filter[]>
  >;
}) {
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
          item.children,
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
      .filter((item) => item.id !== filterId)
      .map((item) => ({
        ...item,
        children: removeRecursive(
          item.children,
          filterId,
        ),
      }));
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
            ...item.children,
            createFilter(),
          ],
        }),
      ),
    );
  };

  const changeType = (
    filterId: number,
    value: string,
  ) => {
    setRootFilters((prev) =>
      updateRecursive(
        prev,
        filterId,
        (item) => {
          if (value === "should") {
            return {
              ...item,
              type: value,
              conditions: [],
              children:
                item.children.length > 0
                  ? item.children
                  : [createFilter()],
            };
          }

          return {
            ...item,
            type: value,
            conditions: [
              createCondition(),
            ],
            children: [],
          };
        },
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
                    [field]: value,
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

      {filter.type !== "should" &&
        filter.conditions.map(
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

      {filter.type === "should" && (
        <div className="pl-5 border-l-2 border-sky-400 flex flex-col gap-5">
          {filter.children.map(
            (child) => (
              <FilterItem
                key={child.id}
                filter={child}
                rootFilters={rootFilters}
                setRootFilters={setRootFilters}
              />
            ),
          )}

          <select
            defaultValue=""
            onChange={(e) => {
              if (!e.target.value)
                return;

              const value =
                e.target.value;

              const newFilter =
                createFilter();

              newFilter.type =
                value;

              newFilter.conditions =
                value === "should"
                  ? []
                  : [createCondition()];

              if (value === "should") {
                newFilter.children = [];
              }

              setRootFilters((prev) =>
                updateRecursive(
                  prev,
                  filter.id,
                  (item) => ({
                    ...item,
                    children: [
                      ...item.children,
                      newFilter,
                    ],
                  }),
                ),
              );

              e.target.value = "";
            }}
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
        </div>
      )}
    </div>
  );
}

export default function Filtermaps({
  filters,
  setFilters,
}: Props) {
  useEffect(() => {
    console.log(
      JSON.stringify(
        filters,
        null,
        2,
      ),
    );
  }, [filters]);

  return (
    <div className="flex flex-col gap-5">
      {filters.map((filter) => (
        <FilterItem
          key={filter.id}
          filter={filter}
          rootFilters={filters}
          setRootFilters={setFilters}
        />
      ))}
    </div>
  );
}