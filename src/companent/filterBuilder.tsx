import { useState } from "react";

const keys = [
    { id: "key_1", name: "Ключ №1" },
    { id: "key_2", name: "Ключ №2" },
    { id: "key_3", name: "Ключ №3" },
];

const selects = [
    { id: "Select_1", name: "select №1" },
    { id: "Select_2", name: "select №2" },
];

const filterTypes = ["range", "exist_key", "where", "from_to"];

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

const FilterBuilder = () => {
    const [filters, setFilters] = useState<Filter[]>([
        {
            id: Date.now(),
            type: "",
            conditions: [{ inValues: [""] }],
        },
    ]);

    const [showShouldBox, setShowShouldBox] =
        useState(false);

    const [shouldFilters, setShouldFilters] =
        useState<Filter[]>([]);

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

    const removeFilter = (filterId: number) => {
        setFilters((prev) =>
            prev.filter((filter) => filter.id !== filterId)
        );
    };

    const addCondition = (filterId: number) => {
        setFilters((prev) =>
            prev.map((filter) =>
                filter.id === filterId
                    ? {
                          ...filter,
                          conditions: [
                              ...filter.conditions,
                              { inValues: [""] },
                          ],
                      }
                    : filter
            )
        );
    };

    const removeCondition = (
        filterId: number,
        conditionIndex: number
    ) => {
        setFilters((prev) =>
            prev.map((filter) =>
                filter.id === filterId
                    ? {
                          ...filter,
                          conditions:
                              filter.conditions.filter(
                                  (_, i) =>
                                      i !== conditionIndex
                              ),
                      }
                    : filter
            )
        );
    };

    const changeType = (
        id: number,
        value: string
    ) => {
        setFilters((prev) =>
            prev.map((filter) =>
                filter.id === id
                    ? {
                          ...filter,
                          type: value,
                          conditions: [
                              { inValues: [""] },
                          ],
                      }
                    : filter
            )
        );
    };

    const addInValue = (
        filterId: number,
        conditionIndex: number
    ) => {
        setFilters((prev) =>
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
                                                    [
                                                        ...condition.inValues,
                                                        "",
                                                    ],
                                            }
                                          : condition
                              ),
                      }
                    : filter
            )
        );
    };

    const removeInValue = (
        filterId: number,
        conditionIndex: number,
        valueIndex: number
    ) => {
        setFilters((prev) =>
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
                                                        (
                                                            _,
                                                            vi
                                                        ) =>
                                                            vi !==
                                                            valueIndex
                                                    ),
                                            }
                                          : condition
                              ),
                      }
                    : filter
            )
        );
    };

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
        filterId: number
    ) => {
        setShouldFilters((prev) =>
            prev.filter(
                (filter) => filter.id !== filterId
            )
        );
    };

    const changeShouldType = (
        id: number,
        value: string
    ) => {
        setShouldFilters((prev) =>
            prev.map((filter) =>
                filter.id === id
                    ? {
                          ...filter,
                          type: value,
                          conditions: [
                              { inValues: [""] },
                          ],
                      }
                    : filter
            )
        );
    };

    const addShouldCondition = (
        filterId: number
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
                    : filter
            )
        );
    };

    const removeShouldCondition = (
        filterId: number,
        conditionIndex: number
    ) => {
        setShouldFilters((prev) =>
            prev.map((filter) =>
                filter.id === filterId
                    ? {
                          ...filter,
                          conditions:
                              filter.conditions.filter(
                                  (_, i) =>
                                      i !== conditionIndex
                              ),
                      }
                    : filter
            )
        );
    };

    const addShouldInValue = (
        filterId: number,
        conditionIndex: number
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
                                                    [
                                                        ...condition.inValues,
                                                        "",
                                                    ],
                                            }
                                          : condition
                              ),
                      }
                    : filter
            )
        );
    };

    const removeShouldInValue = (
        filterId: number,
        conditionIndex: number,
        valueIndex: number
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
                                                        (
                                                            _,
                                                            vi
                                                        ) =>
                                                            vi !==
                                                            valueIndex
                                                    ),
                                            }
                                          : condition
                              ),
                      }
                    : filter
            )
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
                            <span className="text-xs text-gray-400 uppercase tracking-wider">
                                filter {fi + 1}
                            </span>

                            <select
                                value={filter.type}
                                onChange={(e) =>
                                    changeType(
                                        filter.id,
                                        e.target.value
                                    )
                                }
                                className={`${inputClass} w-52`}
                            >
                                <option value="">
                                    select type
                                </option>

                                {filterTypes
                                    .filter(
                                        (type) =>
                                            !filters.some(
                                                (f) =>
                                                    f.type ===
                                                        type &&
                                                    f.id !==
                                                        filter.id
                                            )
                                    )
                                    .map((type) => (
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
                                    removeFilter(
                                        filter.id
                                    )
                                }
                                className="ml-auto h-11 w-11 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                            >
                                ×
                            </button>
                        </div>

                        {filter.conditions.map(
                            (condition, ci) => {
                                if (!filter.type)
                                    return null;

                                return (
                                    <div
                                        key={ci}
                                        className="flex flex-col gap-4"
                                    >
                                        {[
                                            "range",
                                            "where",
                                            "from_to",
                                        ].includes(
                                            filter.type
                                        ) && (
                                            <select
                                                className={`${inputClass} w-56`}
                                            >
                                                {keys.map(
                                                    (
                                                        key
                                                    ) => (
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
                                                    )
                                                )}
                                            </select>
                                        )}

                                        {filter.type ===
                                            "range" && (
                                            <div className="flex flex-wrap items-center gap-3">
                                                <select
                                                    className={`${inputClass} w-24`}
                                                >
                                                    <option>
                                                        gte
                                                    </option>
                                                    <option>
                                                        gt
                                                    </option>
                                                </select>

                                                <input
                                                    type="text"
                                                    placeholder="value"
                                                    className={`${inputClass} w-56`}
                                                />

                                                <select
                                                    className={`${inputClass} w-24`}
                                                >
                                                    <option>
                                                        lte
                                                    </option>
                                                    <option>
                                                        lt
                                                    </option>
                                                </select>

                                                <input
                                                    type="text"
                                                    placeholder="value"
                                                    className={`${inputClass} w-56`}
                                                />
                                            </div>
                                        )}

                                        {filter.type ===
                                            "exist_key" && (
                                            <select
                                                className={`${inputClass} w-56`}
                                            >
                                                {selects.map(
                                                    (
                                                        s
                                                    ) => (
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
                                                    )
                                                )}
                                            </select>
                                        )}

                                        {filter.type ===
                                            "where" && (
                                            <div className="flex flex-col gap-3">
                                                {condition.inValues.map(
                                                    (
                                                        _,
                                                        valueIndex
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
                                                                className={`${inputClass} w-72`}
                                                            />

                                                            <button
                                                                onClick={() =>
                                                                    removeInValue(
                                                                        filter.id,
                                                                        ci,
                                                                        valueIndex
                                                                    )
                                                                }
                                                                className="h-11 px-4 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                                                            >
                                                                - in
                                                            </button>
                                                        </div>
                                                    )
                                                )}

                                                <button
                                                    onClick={() =>
                                                        addInValue(
                                                            filter.id,
                                                            ci
                                                        )
                                                    }
                                                    className="h-11 px-5 rounded-2xl bg-black text-white text-sm hover:opacity-90 transition w-fit"
                                                >
                                                    + in
                                                </button>
                                            </div>
                                        )}

                                        {filter.type ===
                                            "from_to" && (
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

                                        <button
                                            onClick={() =>
                                                removeCondition(
                                                    filter.id,
                                                    ci
                                                )
                                            }
                                            className="h-11 w-11 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                                        >
                                            −
                                        </button>
                                    </div>
                                );
                            }
                        )}

                        {filter.type && (
                            <button
                                onClick={() =>
                                    addCondition(
                                        filter.id
                                    )
                                }
                                className="h-11 w-11 rounded-2xl bg-black text-white text-xl flex items-center justify-center hover:opacity-90 transition"
                            >
                                +
                            </button>
                        )}
                    </div>
                ))}

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() =>
                            setShowShouldBox(
                                (prev) => !prev
                            )
                        }
                        className="h-11 px-6 rounded-2xl border border-gray-300 bg-white text-sm hover:border-black transition w-fit"
                    >
                        Добавить should
                    </button>

                    {showShouldBox && (
                        <div className="w-full border-2 border-dashed border-sky-400 rounded-3xl bg-[#f4f4f4] p-4 min-h-[120px] flex flex-col gap-5">
                            {shouldFilters.map(
                                (
                                    filter,
                                    fi
                                ) => (
                                    <div
                                        key={
                                            filter.id
                                        }
                                        className="flex flex-col gap-5 border border-gray-300 bg-white p-6 rounded-3xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider">
                                                should{" "}
                                                {fi +
                                                    1}
                                            </span>

                                            <select
                                                value={
                                                    filter.type
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    changeShouldType(
                                                        filter.id,
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={`${inputClass} w-52`}
                                            >
                                                <option value="">
                                                    select
                                                    type
                                                </option>

                                                {filterTypes
                                                    .filter(
                                                        (
                                                            type
                                                        ) =>
                                                            !shouldFilters.some(
                                                                (
                                                                    f
                                                                ) =>
                                                                    f.type ===
                                                                        type &&
                                                                    f.id !==
                                                                        filter.id
                                                            )
                                                    )
                                                    .map(
                                                        (
                                                            type
                                                        ) => (
                                                            <option
                                                                key={
                                                                    type
                                                                }
                                                                value={
                                                                    type
                                                                }
                                                            >
                                                                {
                                                                    type
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                            </select>

                                            <button
                                                onClick={() =>
                                                    removeShouldFilter(
                                                        filter.id
                                                    )
                                                }
                                                className="ml-auto h-11 w-11 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        {filter.conditions.map(
                                            (
                                                condition,
                                                ci
                                            ) => {
                                                if (
                                                    !filter.type
                                                )
                                                    return null;

                                                return (
                                                    <div
                                                        key={
                                                            ci
                                                        }
                                                        className="flex flex-col gap-4"
                                                    >
                                                        {[
                                                            "range",
                                                            "where",
                                                            "from_to",
                                                        ].includes(
                                                            filter.type
                                                        ) && (
                                                            <select
                                                                className={`${inputClass} w-56`}
                                                            >
                                                                {keys.map(
                                                                    (
                                                                        key
                                                                    ) => (
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
                                                                    )
                                                                )}
                                                            </select>
                                                        )}

                                                        {filter.type ===
                                                            "range" && (
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <select
                                                                    className={`${inputClass} w-24`}
                                                                >
                                                                    <option>
                                                                        gte
                                                                    </option>

                                                                    <option>
                                                                        gt
                                                                    </option>
                                                                </select>

                                                                <input
                                                                    type="text"
                                                                    placeholder="value"
                                                                    className={`${inputClass} w-56`}
                                                                />

                                                                <select
                                                                    className={`${inputClass} w-24`}
                                                                >
                                                                    <option>
                                                                        lte
                                                                    </option>

                                                                    <option>
                                                                        lt
                                                                    </option>
                                                                </select>

                                                                <input
                                                                    type="text"
                                                                    placeholder="value"
                                                                    className={`${inputClass} w-56`}
                                                                />
                                                            </div>
                                                        )}

                                                        {filter.type ===
                                                            "exist_key" && (
                                                            <select
                                                                className={`${inputClass} w-56`}
                                                            >
                                                                {selects.map(
                                                                    (
                                                                        s
                                                                    ) => (
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
                                                                    )
                                                                )}
                                                            </select>
                                                        )}

                                                        {filter.type ===
                                                            "where" && (
                                                            <div className="flex flex-col gap-3">
                                                                {condition.inValues.map(
                                                                    (
                                                                        _,
                                                                        valueIndex
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
                                                                                className={`${inputClass} w-72`}
                                                                            />

                                                                            <button
                                                                                onClick={() =>
                                                                                    removeShouldInValue(
                                                                                        filter.id,
                                                                                        ci,
                                                                                        valueIndex
                                                                                    )
                                                                                }
                                                                                className="h-11 px-4 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                                                                            >
                                                                                -
                                                                                in
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}

                                                                <button
                                                                    onClick={() =>
                                                                        addShouldInValue(
                                                                            filter.id,
                                                                            ci
                                                                        )
                                                                    }
                                                                    className="h-11 px-5 rounded-2xl bg-black text-white text-sm hover:opacity-90 transition w-fit"
                                                                >
                                                                    +
                                                                    in
                                                                </button>
                                                            </div>
                                                        )}

                                                        {filter.type ===
                                                            "from_to" && (
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

                                                        <button
                                                            onClick={() =>
                                                                removeShouldCondition(
                                                                    filter.id,
                                                                    ci
                                                                )
                                                            }
                                                            className="h-11 w-11 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                                                        >
                                                            −
                                                        </button>
                                                    </div>
                                                );
                                            }
                                        )}

                                        {filter.type && (
                                            <button
                                                onClick={() =>
                                                    addShouldCondition(
                                                        filter.id
                                                    )
                                                }
                                                className="h-11 w-11 rounded-2xl bg-black text-white text-xl flex items-center justify-center hover:opacity-90 transition"
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                )
                            )}

                            <button
                                onClick={
                                    addShouldFilter
                                }
                                className="h-11 px-6 rounded-2xl border border-gray-300 bg-white text-sm hover:border-black transition w-fit"
                            >
                                Добавить should
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={addFilter}
                    className="h-11 px-6 rounded-2xl bg-black text-white text-sm hover:opacity-90 transition w-fit"
                >
                    + Добавить команду
                </button>
            </div>
        </div>
    );
};

export default FilterBuilder;