const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;


const employees = JSON.parse(fs.readFileSync('./employees.json'));
const projects = JSON.parse(fs.readFileSync('./projects.json'));
const tasks = JSON.parse(fs.readFileSync('./tasks.json'));


app.get('/api/employees', (req, res) => {
  res.json(employees);
});


app.get('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = projects.find(p => p.id === projectId);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});


app.get('/api/tasks', (req, res) => {
  const email = req.query.email;
  console.log(req.query);
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const employee = employees.find(e => e.email === email);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });

  const assignedTasks = tasks
    .filter(t => t.assigned_to === employee.id)
    .map(t => {
      const project = projects.find(p => p.id === t.project_id);
      return {
        id: t.id,
        project_id: t.project_id,
        project_name: project ? project.name : 'Unknown Project',
        task_name: t.name,
        assigned_to: employee.name,
        status: t.status
      };
    });

  res.json(assignedTasks);
});


app.get('/api/task_status', (req, res) => { 
    const status = req.query.status; 
    
    const groupedTasks = {}; tasks.forEach(t => { if (t.status === status) 
        { const project = projects.find(p => p.id === t.project_id);
             const projectName = project ? project.name : 'Unknown Project';
              if (!groupedTasks[projectName]) { groupedTasks[projectName] = []; 

              } groupedTasks[projectName].push({ id: t.id, name: t.name, assigned_to: t.assigned_to, status: t.status });
             } }); res.json(groupedTasks);
    });



app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});