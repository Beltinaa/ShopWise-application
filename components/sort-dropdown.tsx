// components/sort-dropdown.tsx
"use client";

import React from "react";
import type { SortKey } from "@/lib/sort-products";

type Props = {
    value: SortKey;
    onChange: (value: SortKey) => void;
};

export function SortDropdown({ value, onChange }: Props) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as SortKey)}
            className="border p-2 rounded"
        >
            <option value="lowest">Lowest to Highest</option>
            <option value="highest">Highest to Lowest</option>
            <option value="location">Location (A-Z)</option>
        </select>
    );
}
