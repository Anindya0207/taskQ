Scenarios:

- Tasks with no dependencies
- Tasks with dependencies pushed in topological order itself (happy flow)
- Tasks with dependencies pushed in jumbled up order. Task B depends on Task A but B got pushed first.
- Concurrancy number should always be less than max parallely executable tasks.
- Task C dependsOn B dependsOn A. after topo sort order is A, B, C. Now A got SUCCESS. B FAILED. C should wait before B SUCCESS
- Task C dependsOn B dependsOn A. after topo sort order is A, B, C. Now A got SUCCESS. B FAILED >3 times or something and Consumer cancels it. C should remain in Queue forever.
- Task A depends on B. Task B depends on A.
