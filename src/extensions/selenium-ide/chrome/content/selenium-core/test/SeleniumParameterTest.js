function SeleniumParameterTest(name) {
    TestCase.call(this,name);
}

SeleniumParameterTest.prototype = new TestCase();
SeleniumParameterTest.prototype.setUp = function() {
    this.mockPageBot = new Mock();

    this.mockBrowserBot = new Mock();

    this.oldSelenium = selenium;
    selenium = new Selenium(this.mockBrowserBot);

    LOG = new DummyLogger();
}

SeleniumParameterTest.prototype.tearDown = function() {
    selenium = this.oldSelenium;
}


SeleniumParameterTest.prototype.testHandleSimpleStrings = function() {
    this.assertEquals('', selenium.preprocessParameter(''));
    this.assertEquals(' ', selenium.preprocessParameter(' '));
    this.assertEquals('ABC', selenium.preprocessParameter('ABC'));
    this.assertEquals('1234567890!@#$%^&*()', selenium.preprocessParameter('1234567890!@#$%^&*()'));
}

SeleniumParameterTest.prototype.testSimpleVariableSubstitution = function() {
    storedVars['var'] = 'value';
    storedVars['var2'] = 'another value';
    this.assertEquals('_value_', selenium.preprocessParameter('_${var}_'));
    this.assertEquals('_value value_', selenium.preprocessParameter('_${var} ${var}_'));
    this.assertEquals('_value another value_', selenium.preprocessParameter('_${var} ${var2}_'));
}

SeleniumParameterTest.prototype.testUnkownVariableNotSubstituted = function() {
    storedVars['var'] = 'value';
    this.assertEquals('_${bar}_',
                 selenium.preprocessParameter('_${bar}_'));
    this.assertEquals('_${bar} value_',
                 selenium.preprocessParameter('_${bar} ${var}_'));
    this.assertEquals('_value ${bar} ${bar} value ${bar}_',
                 selenium.preprocessParameter('_${var} ${bar} ${bar} ${var} ${bar}_'));
}

SeleniumParameterTest.prototype.testSimpleJavascriptEvaluation = function() {
    this.assertEquals('25', selenium.preprocessParameter('javascript{"2" + "5"}'));
    this.assertEquals('25', selenium.preprocessParameter('javascript{5 * 5}'));
}

SeleniumParameterTest.prototype.testVariableSubstitutionDoesntApplyForJavascriptParameters = function() {
    this.assertEquals(' ${foo} ', selenium.preprocessParameter('javascript{" ${foo} "}'));
}

SeleniumParameterTest.prototype.testCanAccessStoredVariablesFromJavascriptParameters = function() {
    storedVars['var'] = 'value';
    this.assertEquals(' value ', selenium.preprocessParameter('javascript{" " + storedVars["var"] + " "}'));
}

SeleniumParameterTest.prototype.testJavascriptEvaluationOfEmptyBody = function() {
    this.assertEquals('javascript{}', selenium.preprocessParameter('javascript{}'));
}

SeleniumParameterTest.prototype.testIllegalJavascriptParameter = function() {
    try {
        selenium.preprocessParameter('javascript{foo}');
    } catch (e) {
        return;
    }
    this.fail("call should have failed");
}
