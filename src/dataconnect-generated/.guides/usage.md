# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createReport, createComment, createVote, getCurrentUserProfile } from '@dataconnect/generated';


// Operation CreateReport:  For variables, look at type CreateReportVars in ../index.d.ts
const { data } = await CreateReport(dataConnect, createReportVars);

// Operation CreateComment:  For variables, look at type CreateCommentVars in ../index.d.ts
const { data } = await CreateComment(dataConnect, createCommentVars);

// Operation CreateVote:  For variables, look at type CreateVoteVars in ../index.d.ts
const { data } = await CreateVote(dataConnect, createVoteVars);

// Operation GetCurrentUserProfile: 
const { data } = await GetCurrentUserProfile(dataConnect);


```