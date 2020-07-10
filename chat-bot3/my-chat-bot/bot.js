// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');

const { MakeReservationDialog } = require('./componentDialogs/makeReservationDialog')

class EchoBot extends ActivityHandler {
    constructor(conversationState,userState) {
        super();

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialogState = conversationState.createProperty("dialogState");
        this.makeReservationDialog = new MakeReservationDialog(this.conversationState,this.userState);
        
        this.previousIntent = this.conversationState.createProperty("previousIntent");
        this.conversationData = this.conversationState.createProperty('conservationData');
        
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
        
        await this.dispatchToIntentAsync(context);
        
        await next();

        });

    this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
            await next();
        });   
    this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context)
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

  

    async sendWelcomeMessage(turnContext) {
        const { activity } = turnContext;

        // Iterate over all new members added to the conversation.
        for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id) {
                const welcomeMessage = `Welcome Here! To Start The Conversation Say Hi`;
                await turnContext.sendActivity(welcomeMessage);
                //await this.sendSuggestedActions(turnContext);
            }
        }
    }

    //async sendSuggestedActions(turnContext) {
     //   var reply = MessageFactory.suggestedActions(['Hi']);
       // await turnContext.sendActivity(reply);
    //}


    async dispatchToIntentAsync(context){

        var currentIntent = '';
        const previousIntent = await this.previousIntent.get(context,{});
        const conversationData = await this.conversationData.get(context,{});   

        if(previousIntent.intentName && conversationData.endDialog === false )
        {
           currentIntent = previousIntent.intentName;

        }
        else if (previousIntent.intentName && conversationData.endDialog === true)
        {
             currentIntent = context.activity.text;

        }
        else
        {
            currentIntent = context.activity.text;
            await this.previousIntent.set(context,{intentName: context.activity.text});

        }
    switch(currentIntent)
    {

        case 'Hi':
        console.log("Inside");
        await this.conversationData.set(context,{endDialog: false});
        await this.makeReservationDialog.run(context,this.dialogState);
        conversationData.endDialog = await this.makeReservationDialog.isDialogComplete();
        console.log("am"+conversationData.endDialog);
        if(conversationData.endDialog)
        {
            //await this.sendWelcomeMessage(context);
            await context.sendActivity("To Again Start The Conversation Say Hi");
           // await this.sendSuggestedActions(context);
            console.log("last: "+conversationData.endDialog);

        }
        
        break;

        case 'hi':
        console.log("Inside");
        await this.conversationData.set(context,{endDialog: false});
        await this.makeReservationDialog.run(context,this.dialogState);
        conversationData.endDialog = await this.makeReservationDialog.isDialogComplete();
        console.log("am"+conversationData.endDialog);
        if(conversationData.endDialog)
        {
            //await this.sendWelcomeMessage(context);
            await context.sendActivity("To Again Start The Conversation Say Hi");
           // await this.sendSuggestedActions(context);
            console.log("last: "+conversationData.endDialog);

        }
        
        break;

        default:
            console.log("Did not match");
            break;
    }


    }


}



module.exports.EchoBot = EchoBot;