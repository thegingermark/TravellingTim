# TravelllingTim
Translink chatbot

1. Register user and gather basic info
2. Give user basic tutorial
	Suggested actions
	Menu
3. Preferences
	setting default location
	setting default destination
	setting new location
	setting new destination
	preference changing
		specific setting
		rerun entire preference flow
		give choice of preference to change
4. Bot queries
	When is next train
		default results to provided "home" destinations
		results specified destinations
		Provide expected time AND scheduled time if possible
		ask if user wants to track notifications for delays
	Where's the nearest station/stop
		Bot requests location/postcode/address
		Bot requests destination from user
		min/max radius

	What price would a ticket be
		single
		return
		weekly
		monthly
		annual
		handle age & time of day	 
5. Notifications
	Notification settings
		Time windows for notifications
		Enable/disable specific notifications
	Weather based notifications
		Rain - train may be full
		Train encouragements based on heavy traffic/road accidents
	Event based notifications
		Popular gigs
	Delay notifications
		
	Next train notifications

Things to consider

1. chatbot personality
	gender unimportant 
	needs a personality
	remain gender neutral
	should have a name - Translink Tim, alliteration is cool
	avoid stereotypes
2. Demo on web or on facebook?

3. Use firebase for notifications?
	
4. Use translink API, use our own API - what does this need to do?

Tech stack
	Create git repo
	Initial commit with files we are gonna use
	for js - weird line ending issue can happen
	Hiroku for hosting bot
	Luis for natural language processing
	DB MySQl - use one.com hosting?
	Use AWS for any webAPI implementation

Potential issue
