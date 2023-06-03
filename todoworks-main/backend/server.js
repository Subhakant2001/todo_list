const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 3000;

mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://subhakanta9437:mern123@mern-todo.hwzhqth.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});

mongoose.connection.on('error', (err) => {
    console.log(`Database connection error: ${err}`);
});

const TaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Done'],
        default: 'Todo'
    }
});

const Task = mongoose.model('Task', TaskSchema);

app.use(express.json());


app.get('/tasks', async (req, res) => {
    try {
        // Fetch all tasks from the database
        const tasks = await Task.find();

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Add a task
app.post('/tasks', async (req, res) => {
    try {
        const { task, tag, status } = req.body;

        const newTask = new Task({
            task: task,
            tag: tag,
            status: status
        });


        const savedTask = await newTask.save();


        res.status(201).json(savedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


app.delete('/tasks/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;


        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }


        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


app.put('/tasks/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { task, tag, status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { task: task, tag: tag, status: status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }


        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});