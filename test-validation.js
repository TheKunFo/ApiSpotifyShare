// Test script for user profile update validation
const { validateUpdateProfile } = require("./middlewares/validation");

// Test cases
const testCases = [
  {
    description: "Valid update with name only",
    body: { name: "John Doe" },
    shouldPass: true,
  },
  {
    description: "Valid update with avatar only",
    body: { avatar: "https://example.com/avatar.jpg" },
    shouldPass: true,
  },
  {
    description: "Valid update with both fields",
    body: { name: "Jane Doe", avatar: "https://example.com/avatar2.jpg" },
    shouldPass: true,
  },
  {
    description: "Invalid - empty body",
    body: {},
    shouldPass: false,
  },
  {
    description: "Invalid - name too short",
    body: { name: "J" },
    shouldPass: false,
  },
  {
    description: "Invalid - invalid avatar URL",
    body: { avatar: "not-a-url" },
    shouldPass: false,
  },
];

console.log("🧪 Testing User Profile Update Validation\n");

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.description}`);

  // Mock request object
  const req = { body: testCase.body };
  const res = {};
  let validationPassed = true;

  // Mock next function to catch validation errors
  const next = (error) => {
    if (error) {
      validationPassed = false;
      console.log(`  ❌ Validation failed: ${error.message}`);
    }
  };

  try {
    validateUpdateProfile(req, res, next);
    if (validationPassed && testCase.shouldPass) {
      console.log("  ✅ Passed as expected");
    } else if (!validationPassed && !testCase.shouldPass) {
      console.log("  ✅ Failed as expected");
    } else {
      console.log("  ⚠️ Unexpected result");
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }

  console.log("");
});

console.log("🎯 Validation testing complete!");
