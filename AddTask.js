import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Modal, 
    FlatList, 
    Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const API_URL = [
    'http://192.168.210.178:8081'
  ];

const AddTask = () => {
    const [taskName, setTaskName] = useState('');
    const [taskCourse, setTaskCourse] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [deadline, setDeadline] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [userId, setUserId] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const navigation = useNavigation(); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const { student_id } = JSON.parse(userData);
                    setUserId(student_id);
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

    const handlePriorityChange = (priority) => {
        setPriority(priority);
        setShowPriorityModal(false);
    };
    
    const priorities = ['High', 'Medium', 'Low'];

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const currentDate = new Date(selectedDate);
            setDeadline(currentDate);
        }
    };

    const handleSubmit = async () => {
        if (!taskName || !taskCourse || !priority || !deadline || !userId) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            await axios.post(`${API_URL}/add_task`, {
                student_id: userId,
                task_name: taskName,
                task_course: taskCourse,
                priority: priority,
                deadline: deadline,
            });
            Alert.alert('Success', 'Task added successfully');
            navigation.navigate('Dashboard');
        } catch (error) {
            console.error('Failed to add task:', error);
            Alert.alert('Error', 'Failed to add task');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Add New Task</Text>
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
            <View style={styles.contentContainer}>
                <View style={styles.form}>
                    <Text style={styles.label}>Task Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Task Name"
                        value={taskName}
                        onChangeText={setTaskName}
                    />
                    <Text style={styles.label}>Task Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Course"
                        value={taskCourse}
                        onChangeText={setTaskCourse}
                    />
                    <TouchableOpacity style={styles.input} onPress={() => setShowPriorityModal(true)}>
                        <Text style={styles.inputText}>{priority ? `Priority: ${priority}` : 'Select Priority'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.inputText}>{deadline.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={deadline}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: '#f5f5f5'
    },
    header: {
        marginTop: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 1000
    },
    logoutIcon: {
        marginLeft: 20
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
        color: '#333'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
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
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
        color: '#333',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
});

export default AddTask;

       
