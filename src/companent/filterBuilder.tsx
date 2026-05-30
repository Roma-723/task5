import { useEffect, useState } from "react";

import {
  Button,
  Card,
  Input,
  Radio,
  Select,
  message,
} from "antd";

import {
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Option } = Select;

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

const createCondition =
  (): Condition => ({
    key: "",
    gte: "",
    lte: "",
    gt: "",
    lt: "",
    from: "",
    to: "",
    values: [""],
  });

const createFilter =
  (): Filter => ({
    id:
      Date.now() +
      Math.random(),
    type: "",
    conditions: [
      createCondition(),
    ],
    children: [],
  });

function buildJson(
  filters: Filter[],
) {
  const result: any = {};

  filters.forEach((filter) => {
    switch (filter.type) {
      case "range":
        result.range =
          filter.conditions.map(
            (c) => ({
              [c.key]: {
                ...(c.gte && {
                  gte: c.gte,
                }),

                ...(c.lte && {
                  lte: c.lte,
                }),

                ...(c.gt && {
                  gt: c.gt,
                }),

                ...(c.lt && {
                  lt: c.lt,
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
          filter.conditions.map(
            (c) => ({
              [c.key]:
                c.values,
            }),
          );

        break;

      case "!where":
        result["!where"] =
          filter.conditions.map(
            (c) => ({
              [c.key]:
                c.values,
            }),
          );

        break;

      case "from_to":
        result.from_to =
          filter.conditions.map(
            (c) => ({
              [c.key]: [
                c.from,
                c.to,
              ],
            }),
          );

        break;

      case "should":
        result.should = (
          filter.children ||
          []
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
  setRootFilters: React.Dispatch<
    React.SetStateAction<
      Filter[]
    >
  >;
};

function FilterItem({
  filter,
  setRootFilters,
}: FilterItemProps) {
  const updateRecursive = (
    items: Filter[],
    filterId: number,
    callback: (
      f: Filter,
    ) => Filter,
  ): Filter[] => {
    return items.map(
      (item) => {
        if (
          item.id === filterId
        ) {
          return callback(
            item,
          );
        }

        return {
          ...item,
          children:
            updateRecursive(
              item.children ||
                [],
              filterId,
              callback,
            ),
        };
      },
    );
  };

  const changeType = (
    filterId: number,
    value: string,
  ) => {
    setRootFilters(
      (prev) =>
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
    setRootFilters(
      (prev) =>
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
    setRootFilters(
      (prev) =>
        updateRecursive(
          prev,
          filterId,
          (item) => ({
            ...item,
            conditions:
              item.conditions.filter(
                (_, i) =>
                  i !==
                  conditionIndex,
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
    setRootFilters(
      (prev) =>
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
                  i ===
                  conditionIndex
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

  const updateValue = (
    filterId: number,
    conditionIndex: number,
    valueIndex: number,
    value: string,
  ) => {
    setRootFilters(
      (prev) =>
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
                  i ===
                  conditionIndex
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
    <Card
      styles={{
        body: {
          padding: 0,
        },
      }}
      style={{
        border: "none",
        background:
          "transparent",
        boxShadow:
          "none",
      }}
    >
      <div className="flex flex-col gap-4">
        {filter.conditions.map(
          (
            condition,
            ci,
          ) => (
            <div
              key={ci}
              className="flex items-center gap-3 flex-wrap"
            >
              <Select
                value={
                  filter.type ||
                  undefined
                }
                placeholder="type"
                size="large"
                className="w-47"
                classNames={{
                  popup: {
                    root: "minimal-select-dropdown",
                  },
                }}
                onChange={(value) =>
                  changeType(
                    filter.id,
                    value,
                  )
                }
              >
                {filterTypes.map(
                  (type) => (
                    <Option
                      key={type}
                      value={type}
                    >
                      {type}
                    </Option>
                  ),
                )}
              </Select>

              {[
                "range",
                "where",
                "!where",
                "from_to",
              ].includes(
                filter.type,
              ) && (
                <Select
                  value={
                    condition.key ||
                    undefined
                  }
                  placeholder="key"
                  size="large"
                  className="w-75"
                  classNames={{
                    popup: {
                      root: "minimal-select-dropdown",
                    },
                  }}
                  onChange={(
                    value,
                  ) =>
                    updateCondition(
                      filter.id,
                      ci,
                      "key",
                      value,
                    )
                  }
                >
                  {keys.map((key) => (
                    <Option
                      key={key.id}
                      value={key.id}
                    >
                      {key.name}
                    </Option>
                  ))}
                </Select>
              )}

              {filter.type ===
                "range" && (
                <>
                  <Select
                    defaultValue=">="
                    size="large"
                    className="w-22"
                    classNames={{
                      popup: {
                        root: "minimal-select-dropdown",
                      },
                    }}
                  >
                    <Option value=">=">
                      {">="}
                    </Option>

                    <Option value=">">
                      {">"}
                    </Option>
                  </Select>

                  <Input
                    placeholder="value"
                    size="large"
                    value={
                      condition.gte
                    }
                    onChange={(e) =>
                      updateCondition(
                        filter.id,
                        ci,
                        "gte",
                        e.target.value,
                      )
                    }
                    className="w-57 minimal-input"
                  />

                  <Select
                    defaultValue="<="
                    size="large"
                    className="w-22"
                    classNames={{
                      popup: {
                        root: "minimal-select-dropdown",
                      },
                    }}
                  >
                    <Option value="<=">
                      {"<="}
                    </Option>

                    <Option value="<">
                      {"<"}
                    </Option>
                  </Select>

                  <Input
                    placeholder="value"
                    size="large"
                    value={
                      condition.lte
                    }
                    onChange={(e) =>
                      updateCondition(
                        filter.id,
                        ci,
                        "lte",
                        e.target.value,
                      )
                    }
                    className="w-57 minimal-input"
                  />
                </>
              )}

              {[
                "exist_key",
                "!exist_key",
              ].includes(
                filter.type,
              ) && (
                <>
                  {condition.values.map(
                    (
                      value,
                      valueIndex,
                    ) => (
                      <Select
                        key={
                          valueIndex
                        }
                        value={
                          value ||
                          undefined
                        }
                        placeholder="select"
                        size="large"
                        className="w-65"
                        classNames={{
                          popup: {
                            root: "minimal-select-dropdown",
                          },
                        }}
                        onChange={(
                          value,
                        ) =>
                          updateValue(
                            filter.id,
                            ci,
                            valueIndex,
                            value,
                          )
                        }
                      >
                        {selects.map(
                          (s) => (
                            <Option
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
                            </Option>
                          ),
                        )}
                      </Select>
                    ),
                  )}
                </>
              )}

              <Button
                size="large"
                className="w-12 h-12 rounded-[14px]"
                icon={
                  <DeleteOutlined />
                }
                onClick={() =>
                  removeCondition(
                    filter.id,
                    ci,
                  )
                }
              />

              <Button
                size="large"
                className="w-12 h-12 rounded-[14px]"
                icon={<PlusOutlined />}
                onClick={() =>
                  addCondition(
                    filter.id,
                  )
                }
              />
            </div>
          ),
        )}
      </div>
    </Card>
  );
}

export default function FilterBuilder() {
  const [filters, setFilters] =
    useState<Filter[]>(
      () => {
        try {
          const saved =
            localStorage.getItem(
              "filters",
            );

          if (!saved) {
            return [
              createFilter(),
            ];
          }

          return JSON.parse(
            saved,
          );
        } catch {
          return [
            createFilter(),
          ];
        }
      },
    );

  useEffect(() => {
    localStorage.setItem(
      "filters",
      JSON.stringify(
        filters,
      ),
    );
  }, [filters]);

  const addFilter = () => {
    setFilters((prev) => [
      ...prev,
      createFilter(),
    ]);
  };

  const clearFilters = () => {
    localStorage.removeItem(
      "filters",
    );

    localStorage.removeItem(
      "filters_json",
    );

    setFilters([
      createFilter(),
    ]);

    message.success(
      "Очищено",
    );
  };

  const saveJson = () => {
    const json =
      buildJson(filters);

    console.clear();

    console.log(
      "%cJSON RESULT",
      `
      background:#111827;
      color:white;
      padding:8px 16px;
      border-radius:8px;
      font-size:14px;
      font-weight:bold;
    `,
    );

    console.log(
      JSON.stringify(
        json,
        null,
        2,
      ),
    );

    localStorage.setItem(
      "filters",
      JSON.stringify(
        filters,
      ),
    );

    localStorage.setItem(
      "filters_json",
      JSON.stringify(
        json,
        null,
        2,
      ),
    );

    message.success(
      "Сохранено",
    );
  };

  return (
    <div className="bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-5 min-h-screen">
      <div className="w-full max-w-362 bg-white rounded-[22px] border border-[#ececec] shadow-[0_10px_40px_rgba(0,0,0,0.08)] px-10 py-8">

        <div className="relative flex items-center justify-center mb-10">
          <h1 className="text-[36px] font-semibold text-[#1f2937]">
            Команды
          </h1>

          <button className="absolute right-0 w-10 h-10 rounded-full hover:bg-[#f3f4f6] text-[#9ca3af] text-[24px] transition">
            ×
          </button>
        </div>

        <div className="flex flex-col gap-7">

          <div className="flex items-center gap-5">
            <span className="text-[18px] text-[#374151]">
              Индекс:
            </span>

            <Select
              placeholder="Выберите"
              size="large"
              className="w-150"
              classNames={{
                popup: {
                  root: "minimal-select-dropdown",
                },
              }}
            />
          </div>

          <Radio.Group
            defaultValue="vertical"
            className="flex items-center gap-6"
          >
            <Radio value="vertical">
              Вертикальный
            </Radio>

            <Radio value="horizontal">
              Горизонтальный
            </Radio>
          </Radio.Group>

          <div className="flex flex-col gap-5">
            {filters.map(
              (filter) => (
                <FilterItem
                  key={filter.id}
                  filter={filter}
                  setRootFilters={
                    setFilters
                  }
                />
              ),
            )}
          </div>

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-3">
              <Button
                size="large"
                className="h-12 px-8 rounded-[14px]"
                onClick={addFilter}
              >
                Добавить команду
              </Button>

              <Button
                size="large"
                className="h-12 px-10 rounded-[14px]"
                onClick={clearFilters}
              >
                Очистить
              </Button>
            </div>

            <Button
              size="large"
              className="h-12 px-16 rounded-[14px] bg-[#111827] text-white! border-0"
              onClick={saveJson}
            >
              Сохранить
            </Button>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
            <p>sfvsd</p>
          </div>
        </div>
      </div>
    </div>
  );
}