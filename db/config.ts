import { column, defineDb, defineTable } from "astro:db";

const Count = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    value: column.number({ default: 0 }),
  },
});

export default defineDb({
  tables: { Count },
});
