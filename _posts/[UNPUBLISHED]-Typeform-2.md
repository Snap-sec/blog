# Account takeover via stored XSS in a form field.

Right after our recon phase was over our various members were engaging with their *preffered application parts* to discover the treasures every hacker is craving for. This was an interactive application and would not easily pass us. 

The app provides  capability to non tech users to design forms and surveys without writing a single line of code.One of *our members*  was trying to access the *form logs* and for that there must be *some responses submitted on the form created by the owner*. The *form link* to submit responses was shared with us and it contained various *fields* and the idea of *trying xss on all input fields* popped in our minds right there. 

{{picture or anything}}

First attempt to *write* javascript code in the *input fields directly* was futile as it didn't accepted these characters in the fields. Then we tried  to *intercept* the request on *form submit button* and following body which contained *input field names* and their *values*:

```code snippet
Codesnippet
```

Changing every value to ```javascript:alert('snapsec')``` and forwarding it to the *recepient* . No error was observed implied that our response was stored and submitted successfully to the *owner of the form*.  In this context we had access to the owner's account as well and the prebuilt feature to *view the responses* submitted on the form told us exactly where to look for the trigger.

After *spending time* on the *form responses* it came to limelight that only *the javascript code* injected in the *website field* was *popping up alert*  others were either sanitized or removed but the *website response was being stored without any sanitization*.

## Escalating the stored xss to accout takeover an overview

### Fill this part i guess there not much i can do here. so leaving it to you.





## Summary

- Identifying the input fields to inject  the malicious ```javascript code```.
- Confirm if it is *stored/reflected* type of xss.
- Escalation from pop up to account take over.

## Takeaways:

1. Add a few takeaways from this report.


