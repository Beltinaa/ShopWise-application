// components/sort-dropdown.tsx
"use client";

import React from "react";

type Props = {
    value: "lowest" | "highest"; // ose "asc" | "desc" në varësi të logjikës
    onChange: (value: "lowest" | "highest") => void;
};

export function SortDropdown({ value, onChange }: Props) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as "lowest" | "highest")}
            className="border p-2 rounded"
        >
            <option value="lowest">Lowest to Highest</option>
            <option value="highest">Highest to Lowest</option>
        </select>
    );
}
