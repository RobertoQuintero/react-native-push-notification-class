import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Switch } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

const DEFAULT_PREFERENCES = [
  {
    title: 'General Announcements',
    topicId: 'general-announcements',
    subscribed: true,
  },
  {
    title: 'Character Details',
    topicId: 'character-details',
    subscribed: true,
  },
];

export const Settings = () => {
  const [preferences, setPreferences] = useState([]);

  const setPreference = (newPrefence) => {
    const newPreferences = preferences.map((preference) => {
      if (preference.topicId === newPrefence.topicId) {
        return newPrefence;
      }

      return preference;
    });

    setPreferences(newPreferences);
  };

  useEffect(() => {
    AsyncStorage.getItem('DEMO_APP::PUSH_TOPICS').then((results) => {
      if (results) {
        setPreferences(JSON.parse(results));
      } else {
        setPreferences(DEFAULT_PREFERENCES);
      }
    });
  }, []);

  useEffect(() => {
    preferences.forEach((preference) => {
      if (preference.subscribed) {
        messaging().subscribeToTopic(preference.topicId);
      } else {
        messaging().unsubscribeFromTopic(preference.topicId);
      }
    });

    AsyncStorage.setItem('DEMO_APP::PUSH_TOPICS', JSON.stringify(preferences));
  }, [preferences]);

  return (
    <ScrollView>
      {preferences.map((preference) => {
        return (
          <View
            key={preference.topicId}
            style={{
              flex: 1,
              flexDirection: 'row',
              paddingHorizontal: 20,
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}
          >
            <Text>{preference.title}</Text>
            <Switch
              value={preference.subscribed}
              onValueChange={() => {
                setPreference({
                  ...preference,
                  subscribed: !preference.subscribed,
                });
              }}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};
