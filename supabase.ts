import { createClient } from "@supabase/supabase-js";
import { env } from "~/env.mjs";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const supabase = createClient(
  "https://asyeigrqmlroiedgrsjh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeWVpZ3JxbWxyb2llZGdyc2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQwNTc3NTYsImV4cCI6MTk5OTYzMzc1Nn0.B9noSGyWIhSuJDMv0ylNx5cExW5hNaiYXo8kwn0hWic"
);

const CDNURL =
  "https://asyeigrqmlroiedgrsjh.supabase.co/storage/v1/object/public/multimedia";

export { supabase, CDNURL };
