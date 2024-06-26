import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const API_URL = 'http://192.168.210.178:8081';

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [tasks, setTasks] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const fetchTasks = async () => {
                try {
                    const userData = await AsyncStorage.getItem('userData');
                    if (userData) {
                        const { student_id } = JSON.parse(userData);
                        setTasks([]);
                        const response = await axios.get(`${API_URL}/tasklist?student_id=${student_id}`);
                        setTasks(response.data);
                    } else {
                        navigation.navigate('Login');
                    }
                } catch (error) {
                    console.error('Failed to fetch tasks:', error);
                }
            };

            fetchTasks();
        }, [])
    );

    useEffect(() => {
        const getUserData = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const parsedUserData = JSON.parse(userData);
                setUser(parsedUserData);

                fetchTasks(parsedUserData.student_id);
            } else {
                navigation.navigate('Login');
            }
        };

        getUserData();
    }, []);

    const fetchTasks = async (student_id) => {
        try {
            const response = await axios.get(`${API_URL}/tasklist?student_id=${student_id}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const { student_id } = JSON.parse(userData);
                await AsyncStorage.removeItem('userData');
                await axios.post(`${API_URL}/logout`, { student_id });
                navigation.navigate('Login');
            } else {
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const markAsDone = async (taskId, isChecked) => {
        try {
            console.log("Task ID:", taskId);
            console.log("isChecked:", isChecked);
            await axios.patch(`${API_URL}/update_task/${taskId}`, {
                mark_as_done: isChecked ? 1 : 0
            });

            const updatedTasks = tasks.map(task => {
                if (task.id === taskId) {
                    return { ...task, mark_as_done: isChecked };
                }
                return task;
            });
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.post(`${API_URL}/delete_task`, { id: taskId });
            // After deleting task, fetch updated tasks
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const { student_id } = JSON.parse(userData);
                fetchTasks(student_id);
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const generateUserName = () => {
        if (user.middlename && user.middlename.length > 0) {
            return `${user.firstname} ${user.middlename.charAt(0)}. ${user.lastname}`;
        }
        return `${user.firstname} ${user.lastname}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
        return `${year}/${month}/${day}`;
    };

    const sortTasksByPriority = () => {
        const sortedTasks = [...tasks].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.priority.localeCompare(b.priority);
            } else {
                return b.priority.localeCompare(a.priority);
            }
        });
        setTasks(sortedTasks);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Task Tracker</Text>
                <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.profileContainer}>
                    <Icon name="user" size={24} color="#333" />
                </TouchableOpacity>
                {/* Dropdown menu */}
                {dropdownVisible && (
                    <View style={styles.dropdown}>
                        <View style={styles.userNameContainer}>
                            <Text style={styles.userName}>
                                {generateUserName()}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleLogout}>
                            <Text style={styles.dropdownText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <Button title="Add Task" onPress={() => navigation.navigate('AddTask')} />
            <View style={styles.sortButtonContainer}>
                <TouchableOpacity onPress={sortTasksByPriority} style={styles.sortButton}>
                    <Text style={styles.sortButtonText}>Sort by Priority</Text>
                    <Icon name={sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'} size={16} color="#333" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskContainer}>
                        <Text style={styles.taskTitle}>{item.task_name}</Text>
                        <Text style={styles.taskDescription}>{item.task_course}</Text>
                        <Text style={styles.taskPriority}>Priority: {item.priority}</Text>
                        <Text style={styles.taskDeadline}>Deadline: {formatDate(item.deadline)}</Text>
                        <View style={styles.taskActions}>
                            <TouchableOpacity onPress={() => markAsDone(item.id, !item.mark_as_done)}>
                                <Text>{item.mark_as_done ? 'Unmark as done' : 'Mark as done'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('UpdateTask', { taskId: item.id })}>
                                <Text>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );  
};

const ContactList = () => {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.name}>Joshua Valmoria</Text>
          <Text style={styles.email}>valmoria.joshua92@gmail.com</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.name}>Emmanuelle James Duallo</Text>
          <Text style={styles.email}>dualloemmanuelle@gmail.com</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.name}>Zeneth Velarde</Text>
          <Text style={styles.email}>velardezeneth@gmail.com</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.name}>Ian Denver Curiba</Text>
          <Text style={styles.email}>curibaiandenver@gmail.com</Text>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5' // Changed background color
    },
    header: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff', // Added background color
        paddingHorizontal: 20, // Added horizontal padding
        paddingVertical: 15, // Added vertical padding
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 1000
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333' // Changed text color
    },
    profileContainer: {
        position: 'relative',
        marginLeft: 10 // Added margin to separate from title
    },
    dropdown: {
        position: 'absolute',
        top: 70,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 1000
    },
    dropdownText: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#333' // Changed text color
    },
    userNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333' // Changed text color
    },
    sortButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 16,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    sortButtonText: {
        fontSize: 16,
        marginRight: 8,
        color: '#333'
    },
    taskContainer: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333' // Changed text color
    },
    taskDescription: {
        fontSize: 16,
        marginVertical: 8,
        color: '#555' // Changed text color
    },
    taskPriority: {
        fontSize: 16,
        color: '#000' // Changed text color
    },
    taskDeadline: {
        fontSize: 16,
        color: '#000' // Changed text color
    },
    taskActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8
    }
});

export default Dashboard;
