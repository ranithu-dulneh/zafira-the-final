import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge tailwind classes correctly", () => {
    const result = cn("text-white", "bg-black");
    expect(result).toBe("text-white bg-black");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("text-white", isActive && "bg-black");
    expect(result).toBe("text-white bg-black");
  });

  it("should resolve conflicts correctly", () => {
    const result = cn("p-4", "p-8");
    expect(result).toBe("p-8"); // twMerge behavior
  });
});
