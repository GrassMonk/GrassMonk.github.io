Demonstration of MATTER's functionality:

DO NOT USE INTERNET EXPLORER!

The first option you will encounter is the metamorphic relation selection. 
We have hardcoded and pre-defined Metamorphic Relation Output Patterns (MROPS), 
which can be used or customised by the user.
Show MROPs to see the definitions of the MROPs.

First, lets add a custom relation!
1. Select the "Add Relation" tab.
	The values have been predefined for a translation metamorphic relation as an example,
	however it is possible to define any relation in this tab.
	Inputs:
	- The relation name serves as an ID and label for the relation being added.
	- The Result verification code (in JavaScript) compares the source and follow-up data. 
	  If this data violates the relation, an error is concatenated to the errors string.
2. Click "ADD RELATION".
	A green success message should pop up. This means the relation has been added.
	You should also be able to see the relation you just defined as a radio option above.

After the relation has been selected, you may either upload manual test data from an external .txt file,
or add an API, and test it automatically.
First we shall do a manual test.
1. Select the "Manual" tab.
	define
	inputs

2. Click "Test".
	The results from the test shall be output below.


Now lets do an automatic test case generation.
1. Select the "Add API" tab.
	The values have been pre-defined for Google's Youtube search API as an example, 
	however any API can be used as long as it has been defined correctly, 
	and the required scripts have been added to the end of the metamorphicTest.html body. 
	Inputs:
	- The API name serves as an ID and label for the API being added.
	- The API URL is the location of the API.
	- The API key is required in order to access the API.
	- The default data parameters are the parameters in your request which will always be set (unless overwritten).
	- The path from the data retrieved to the data that you wish to load into the test.

2. Click "ADD API".
	A green success message should pop up. This means the API has been added.

3. Select the "Automatic" tab.
	There should now be a radio button with the API name as a label.
	Ensure that this is selected before continuing.

4. Modify source and follow-up data parameters.
	Parameters for Youtube Search API can be found here:
	https://developers.google.com/youtube/v3/docs/search/list#parameters
	Ensure that your parameters are written in JavaScript Object Notation:
	- Begin and end your input with curly brackets - {}
	- Write your parameters and values inside quotations - ""
	- Seperate your parameters from values with a colon - :
	- Seperate each "parameter":"value" with a comma - ,
	
	If you wish, you may add extra follow-up sets.

5. Finally, click "test"!
	Errors shall list below. 
	If you got an error: "Request failed: Invalid parameters.",
	please review your parameter inputs and ensure they are in JSON. 
	If this is not the cause of the error, and you defined your own API, 
	ensure that your API definition is correct, and that the corresponding API scripts have 
	been linked to the metamorphicTest.html.