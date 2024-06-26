import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = [
    'http://192.168.210.178:8081'
  ];

const UpdateTask = ({ route, navigation }) => {
    const { taskId } = route.params;

    const [task, setTask] = useState({
        id: '',
        task_name: '',
        task_course: '',
        priority: '',
        deadline: new Date(), // Initialize with current date
    });
    const [user, setUser] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/tbl_tasklist/${taskId}`);
                const taskData = response.data[0];
                taskData.deadline = new Date(taskData.deadline); // Convert deadline to Date object
                setTask(taskData);
            } catch (error) {
                console.error('Failed to fetch task:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const { firstname, middlename, lastname } = JSON.parse(userData);
                    setUser({ firstname, middlename, lastname });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userData');
        navigation.navigate('Login');
    };

    const updateTask = async () => {
        try {
            await axios.put(`${API_URL}/update_task/${task.id}`, task, {
                headers: { 'Content-Type': 'application/json' }
            });
            navigation.navigate('Dashboard');
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const generateUserName = () => {
        if (user.middlename) {
            return `${user.firstname} ${user.middlename.charAt(0)}. ${user.lastname}`;
        }
        return `${user.firstname} ${user.lastname}`;
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false); // Close DateTimePicker when date is selected
        if (selectedDate) {
            const currentDate = new Date(selectedDate);
            
            const timezoneOffset = currentDate.getTimezoneOffset();
            currentDate.setMinutes(currentDate.getMinutes() - timezoneOffset);

            setTask({ ...task, deadline: currentDate });
        }
    };

    const handlePriorityChange = (priority) => {
        setTask((prevTask) => ({ ...prevTask, priority }));
        setShowPriorityModal(false);
    };

    const priorities = ['High', 'Medium', 'Low'];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <Text style={styles.title}>Update Task Details</Text>
                <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.profileContainer}>
                    <Icon name="user" size={24} color="#333" />
                </TouchableOpacity>
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
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Task Name"
                    value={task.task_name}
                    onChangeText={(text) => setTask((prevTask) => ({ ...prevTask, task_name: text }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Task Description"
                    value={task.task_course}
                    onChangeText={(text) => setTask((prevTask) => ({ ...prevTask, task_course: text }))}
                />
                <TouchableOpacity style={styles.input} onPress={() => setShowPriorityModal(true)}>
                    <Text style={styles.inputText}>{task.priority ? `Priority: ${task.priority}` : 'Select Priority'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.inputText}>{task.deadline.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={task.deadline}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
                <TouchableOpacity style={styles.button} onPress={updateTask}>
                    <Text style={styles.buttonText}>Update Task</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={showPriorityModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPriorityModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowPriorityModal(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Priority</Text>
                        <FlatList
                            data={priorities}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => handlePriorityChange(item)}
                                >
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginTop: 150,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
  },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    profileContainer: {
        marginLeft: 'auto',
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
        },
        dropdownText: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#333',
        },
        userNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        },
        userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        },
        sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        },
        form: {
        width: '100%',
        },
        input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        fontSize: 16,
        },
        inputText: {
        fontSize: 16,
        color: '#000',
        },
        button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
        borderRadius: 5,
        },
        buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        },
        modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        },
        modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        },
        modalItem: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        width: '100%',
        alignItems: 'center',
        },
        modalItemText: {
        fontSize: 18,
        },
        });
        
        export default UpdateTask;