import React from 'react';
import { Browser } from './styles';

export default function Repo({ navigation }) {
  const repo = navigation.getParam('repo');

  return (
    <Browser source={{ uri: repo.html_url }} />
  );
}

Repo.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repo').name,
})
