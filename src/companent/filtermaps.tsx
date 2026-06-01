import { useEffect } from "react";

import {
  Button,
  Input,
  Select,
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
];

const selects = [
  {
    id: "select_1",
    name: "Select №1",
  },
  {
    id: "select_2",
    name: "Select №2",
  },
  {
    id: "select_3",
    name: "Select №3",
  },
];

const filterTypes = [
  "range",
  "where",
  "!where",
  "exist_key",
  "!exist_key",
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

export type Filter = {
  id: number;
  type: string;
  conditions: Condition[];
  children: Filter[];
};

type Props = {
  filters: Filter[];
  setFilters: React.Dispatch<
    React.SetStateAction<
      Filter[]
    >
  >;
};

const createCondition =
  (): Condition => ({
    key: "",
    gte: "",
    lte: "",
    from: "",
    to: "",
    values: [""],
  });

export const createFilter =
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

function FilterItem({
  filter,
  rootFilters,
  setRootFilters,
}: {
  filter: Filter;
  rootFilters: Filter[];
  setRootFilters: React.Dispatch<
    React.SetStateAction<
      Filter[]
    >
  >;
}) {
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
              item.children,
              filterId,
              callback,
            ),
        };
      },
    );
  };

  const removeRecursive = (
    items: Filter[],
    filterId: number,
  ): Filter[] => {
    return items
      .filter(
        (item) =>
          item.id !==
          filterId,
      )
      .map((item) => ({
        ...item,
        children:
          removeRecursive(
            item.children,
            filterId,
          ),
      }));
  };

  const changeType = (
    value: string,
  ) => {
    setRootFilters(
      (prev) =>
        updateRecursive(
          prev,
          filter.id,
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

  const updateCondition = (
    field: keyof Condition,
    value: string,
  ) => {
    setRootFilters(
      (prev) =>
        updateRecursive(
          prev,
          filter.id,
          (item) => ({
            ...item,
            conditions:
              item.conditions.map(
                (
                  condition,
                ) => ({
                  ...condition,
                  [field]:
                    value,
                }),
              ),
          }),
        ),
    );
  };

  const addValue = () => {
    setRootFilters(
      (prev) =>
        updateRecursive(
          prev,
          filter.id,
          (item) => ({
            ...item,
            conditions:
              item.conditions.map(
                (
                  condition,
                ) => ({
                  ...condition,
                  values: [
                    ...condition.values,
                    "",
                  ],
                }),
              ),
          }),
        ),
    );
  };
  const removeValue = (
    valueIndex: number,
  ) => {
    setRootFilters(
      (prev) =>
        updateRecursive(
          prev,
          filter.id,
          (item) => ({
            ...item,
            conditions:
              item.conditions.map(
                (
                  condition,
                ) => ({
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
                }),
              ),
          }),
        ),
    );
  };

  const updateValue = (
    valueIndex: number,
    value: string,
  ) => {
    setRootFilters(
      (prev) =>
        updateRecursive(
          prev,
          filter.id,
          (item) => ({
            ...item,
            conditions:
              item.conditions.map(
                (
                  condition,
                ) => ({
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
                }),
              ),
          }),
        ),
    );
  };

  return (
    <div className="rounded-[26px] border border-[#ebebeb] bg-white p-5 shadow-sm flex flex-col gap-5">

      <div className="flex flex-wrap items-center gap-3">

        <Select
          value={
            filter.type ||
            undefined
          }
          placeholder="type"
          size="large"
          className="w-57"
          onChange={changeType}
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
                filter
                  .conditions[0]
                  ?.key ||
                undefined
              }
              placeholder="key"
              size="large"
              className="w-[320px]"
              onChange={(value) =>
                updateCondition(
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
            <div className="flex items-center gap-3 flex-wrap">

              <Select
                defaultValue=">="
                size="large"
                className="w-21"
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
                className="w-65"
                value={
                  filter
                    .conditions[0]
                    ?.gte
                }
                onChange={(e) =>
                  updateCondition(
                    "gte",
                    e.target.value,
                  )
                }
              />

              <Select
                defaultValue="<="
                size="large"
                className="w-21"
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
                className="w-65"
                value={
                  filter
                    .conditions[0]
                    ?.lte
                }
                onChange={(e) =>
                  updateCondition(
                    "lte",
                    e.target.value,
                  )
                }
              />
            </div>
          )}
        {[
          "where",
          "!where",
        ].includes(
          filter.type,
        ) && (
            <>
  <p>name</p>
  <p>name</p>
  <p>name</p>
  <p>name</p>

              {filter.conditions[0]?.values.map(
                (
                  value,
                  valueIndex,
                ) => (
                  <div
                    key={
                      valueIndex
                    }
                    className="flex items-center gap-2"
                  >
                    <Input
                      placeholder="value"
                      size="large"
                      className="w-60"
                      value={value}
                      onChange={(
                        e,
                      ) =>
                        updateValue(
                          valueIndex,
                          e.target
                            .value,
                        )
                      }
                    />

                    <Button
                      danger
                      size="large"
                      className="rounded-2xl"
                      onClick={() =>
                        removeValue(
                          valueIndex,
                        )
                      }
                    >
                      -
                    </Button>
                  </div>
                ),
              )}

              <Button
                size="large"
                className="rounded-2xl"
                onClick={addValue}
              >
                + in
              </Button>
            </>
          )}

        {[
          "exist_key",
          "!exist_key",
        ].includes(
          filter.type,
        ) && (
            <>
              {filter.conditions[0]?.values.map(
                (
                  value,
                  valueIndex,
                ) => (
                  <div
                    key={
                      valueIndex
                    }
                    className="flex items-center gap-2"
                  >
                    <Select
                      value={
                        value ||
                        undefined
                      }
                      placeholder="Please select"
                      size="large"
                      className="w-75"
                      onChange={(
                        value,
                      ) =>
                        updateValue(
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

                    <Button
                      danger
                      size="large"
                      className="rounded-2xl"
                      onClick={() =>
                        removeValue(
                          valueIndex,
                        )
                      }
                    >
                      -
                    </Button>
                  </div>
                ),
              )}

              <Button
                size="large"
                className="rounded-2xl"
                onClick={addValue}
              >
                + select
              </Button>
            </>
          )}

        {filter.type ===
          "from_to" && (
            <div className="flex flex-col gap-3">
              <Input
                placeholder="from"
                size="large"
                className="w-60"
                value={
                  filter
                    .conditions[0]
                    ?.from
                }
                onChange={(e) =>
                  updateCondition(
                    "from",
                    e.target.value,
                  )
                }
              />

              <Input
                placeholder="to"
                size="large"
                className="w-60"
                value={
                  filter
                    .conditions[0]
                    ?.to
                }
                onChange={(e) =>
                  updateCondition(
                    "to",
                    e.target.value,
                  )
                }
              />
            </div>
          )}

        <Button
          danger
          size="large"
          className="rounded-2xl"
          icon={
            <DeleteOutlined />
          }
          onClick={() =>
            setRootFilters(
              (prev) =>
                removeRecursive(
                  prev,
                  filter.id,
                ),
            )
          }
        />

        <Button
          size="large"
          className="rounded-2xl"
          icon={<PlusOutlined />}
          onClick={() =>
            setRootFilters(
              (prev) => [
                ...prev,
                createFilter(),
              ],
            )
          }
        />
      </div>

      {filter.type ===
        "should" && (
          <div className="rounded-3xl border-2 border-dashed border-sky-300 bg-sky-50/50 p-5 flex flex-col gap-5">

            {filter.children.map(
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

            <Select
              placeholder="Select type"
              size="large"
              className="w-65"
              onChange={(value) => {
                const newFilter =
                  createFilter();
                newFilter.type =
                  value;
                setRootFilters(
                  (prev) =>
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
              }}>
              {filterTypes.map(
                (type) => (
                  <Option
                    key={type}
                    value={type}>
                    {type}
                  </Option>
                ),
              )}
            </Select>
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