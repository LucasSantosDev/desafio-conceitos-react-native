import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repository, setRepository] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get("repositories");

        if (data && data.length > 0) {
          setRepository(data);
        }
      } catch (error) {
        console.error("Exception > ", error);
      }
    }

    fetchData();
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    if (!response) {
      console.error("Erro ao dar like");
    }

    const repositoryIndex = repository.findIndex(
      (repository) => repository.id === id
    );

    repository[repositoryIndex].likes += 1;

    setRepository([]);
    setRepository(repository);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <FlatList
        style={styles.container}
        data={repository}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item: r }) => (
          <View style={styles.repositoryContainer}>
            <Text style={styles.repository}>
              {r.title.length > 15 ? `${r.title.substring(0, 15)}...` : r.title}
            </Text>

            <View style={styles.techsContainer}>
              {r.techs &&
                r.techs.map((t) => (
                  <Text key={`${t}`} style={styles.tech}>
                    {t}
                  </Text>
                ))}
            </View>

            <View style={styles.likesContainer}>
              <Text style={styles.likeText} testID={`repository-likes-${r.id}`}>
                {`${r.likes} curtidas`}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(r.id)}
              testID={`like-button-${r.id}`}
            >
              <Text style={styles.buttonText}>Curtir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
