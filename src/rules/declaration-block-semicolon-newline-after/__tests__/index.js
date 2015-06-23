import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}")
  tr.ok("a { color: pink;\n}")
  tr.ok("a::before { content: \";a\";\n}")
  tr.ok("a {\ncolor: pink;\n top:0;\n}")
  tr.ok("a {\ncolor: pink;\n  top:0;\n}")
  tr.ok("a {\ncolor: pink;\n\ttop:0;\n}")
  tr.ok("a { color: pink;\ntop: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a { color: pink;\ntop: 0;}", "no space between trailing semicolon and closing brace")
  tr.ok("a { color: pink;\ntop: 0}")
  tr.ok("a {\n  color: pink; /* 1 */\n  top: 0\n}", "end-of-line comment")
  tr.ok("a {\n  color: pink;\n  /* 1 */\n  top: 0\n}", "next-line comment")

  tr.notOk("a { color: pink;top: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink; top: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink; top: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.expectedAfter())
  tr.notOk(
    "a {\n  color: pink;  /* 1 */\n  top: 0\n}",
    messages.expectedAfter(),
    "end-of-line comment with two spaces before"
  )
  tr.notOk(
    "a {\n  color: pink; /* 1 */ top: 0\n}",
    messages.expectedAfter(),
    "next node is comment without newline after"
  )
})

testRule("never", tr => {
  tr.ok("a {}")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";\na\"; }")
  tr.ok("a { color: pink;top: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a { color: pink;top: 0;}", "no space between trailing semicolon and closing brace")

  tr.notOk("a { color: pink; top: 0; }", messages.rejectedAfter())
  tr.notOk("a { color: pink;  top: 0; }", messages.rejectedAfter())
  tr.notOk("a { color: pink;\ntop: 0; }", messages.rejectedAfter())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.rejectedAfter())
})

testRule("always-multi-line", tr => {
  tr.ok("a {}")
  tr.ok("a {\ncolor: pink;\n}")
  tr.ok("a::before {\ncontent: \";a\";\n}")
  tr.ok("a {\ncolor: pink;\n top:0;\n}")
  tr.ok("a {\ncolor: pink;\n  top:0;\n}")
  tr.ok("a {\ncolor: pink;\n\ttop:0;\n}")
  tr.ok("a {\ncolor: pink;\ntop: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a {\ncolor: pink;\ntop: 0;}", "no space between trailing semicolon and closing brace")

  // Ignore single-line
  tr.ok("a { color: pink; top: 0; }")
  tr.ok("a { color: pink; /* 1 */ top: 0; }")

  tr.notOk("a {\ncolor: pink;top: 0;\n}", messages.expectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink; top: 0;\n}", messages.expectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink; top: 0;\n}", messages.expectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;\ttop: 0;\n}", messages.expectedAfterMultiLine())
})

testRule("never-multi-line", tr => {
  tr.ok("a {}")
  tr.ok("a {\ncolor: pink;\n}")
  tr.ok("a::before {\ncontent: \";\na\";\n}")
  tr.ok("a {\ncolor: pink;top: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a {\ncolor: pink;top: 0;}", "no space between trailing semicolon and closing brace")

  // Ignore single-line
  tr.ok("a { color: pink; top: 0; }")

  tr.notOk("a {\ncolor: pink; top: 0;\n}", messages.rejectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;  top: 0;\n}", messages.rejectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;\ntop: 0;\n}", messages.rejectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;\ttop: 0;\n}", messages.rejectedAfterMultiLine())
})