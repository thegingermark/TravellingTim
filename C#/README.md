# Travelling Tim API #
This API was built to feed the Travelling Tim chatbot with live train and weather data. 
The APIs backend leverages OpenData from Translink to provide up to date and accurate information where possible.

## Pre-Requisites ##
* .NET Core 2.0
* Visual Studio 2015 or 2017

## Web API - C#\Travel.API ##
The WebAPI consists of 3 controllers

* TrainDataController
This controller provides all train timetable information with the following GET request(s):

 GetTrainStationByName - this allows users to fetch a train station's name, 
 location and next train time by using the name of the train station

 GetNearestStationByLocation - This allows users to provide location information and to find the 
 nearest train station to them. 
 This location information is based on linear lines, and not map routing information.

 GetTrainAtNearestTime -  this allows users to get the next scheduled train available.
 Users can optionally provide a station name or a specific time.

* WeatherController
This controller provides users with weather information with the following GET request(s):

  IsWeatherBad - this allows users to provide a datetime value to get up to date weather
  information for Belfast.
  
* UserController
This controller is currently unused

* ValuesController
This controller is currently unused

All of these controllers return data using a common data model named JsonModel.cs, and all responses return as JSON 
objects by default.

## Consumer - C#\TranslinkConsumer  ##
All API GET requests use consumer classes to fetch and format data.
This allows us to keep the API focused on simply delivering information.

These classes are intended to be used exclusively by the API.

* StationHelper.cs
This class contains some public methods that make use of OpenData APIs to fetch accurate information on
Train services.

* WeatherAPIHelper.cs
This class contains a simple public method to fetch live weasther data from Timon's weather dataset

## Models C#\TranslinkModels ##
We use model classes to let us return several pieces of data contained in one object.

* JsonModel.cs
This model is used by API controllers to return data to users in a consistent format. The model used the following fields:-
 1. error
 This field allows us to provide any error text we want to provide users if something has gone wrong.
 
 2. success
 This field allows us to quickly determine if a request was successful by using a True/False value.
 
 3. data
 This field is used to contain any relevant data (in the form of a model) to return to our users
 
 * StationModel.cs
 This model is returned when any train data is requested. This model uses the following fields:-
 
 1. name
 This contains the name of the station being returned
 
 2. longitude
 This contains longitude location information for the train station being returned
 
 3. latitude
  This contains latitude location information for the train station being returned

 4. scheduledTime
 This is the time that the train is scheduled to arrive at the station being returned
 
 5. expectedTime
 This is the time that the train is expected to arrive at the station being returned
 
 * WeatherModel.cs
 This model is currently unused
