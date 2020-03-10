import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  List,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  }

  state = {
    stars: [],
    loading: true,
    page: 1,
    refresh: false,
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const { loading } = this.state;
    this.setState({ loading: true });
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);
    this.setState({ stars: response.data, loading: false });
  }

  loadMore = async () => {
    const { navigation } = this.props;
    const { stars, page } = this.state;
    this.setState({ page: page + 1 });
    const user = navigation.getParam('user');
    console.tron.log(page);
    console.tron.log(stars);

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
      }
    })
    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      loading: false,
    })
  }

  refreshList = () => {
    const { loading, refresh, page } = this.state;
    this.setState({ page: 1 })

    this.setState({ refresh: false, stars: [] }, this.loadMore);

  }

  handleNavigate = repo => {
    const { navigation } = this.props;

    navigation.navigate('Repo', { repo });
  }

  render() {
    const { navigation } = this.props;
    const { stars, loading, refresh } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading
          ? <ActivityIndicator color='#111' />
          : <List
            data={stars}
            onRefresh={this.refreshList}
            refreshing={refresh}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        }
      </Container>
    )
  }
}
