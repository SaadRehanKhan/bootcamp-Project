document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateButton');
    const skillInput = document.getElementById('firstfield');
    const levelSelect = document.getElementById('knowledge');
    const goalTextarea = document.getElementById('goal');
    const timeInput = document.getElementById('path');

    generateButton.addEventListener('click', async () => {
        const skill = skillInput.value;
        const level = levelSelect.value;
        const goal = goalTextarea.value;
        const time = timeInput.value;

        if (!skill || !goal || !time) {
            alert('Please fill in all the fields.');
            return;
        }

        const backendUrl = 'http://localhost:3000/api/generate-path'; 

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ skill, level, goal, time })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend Error:', errorData);
                alert(`Failed to generate learning path. Error: ${response.statusText}`);
                return;
            }

            const data = await response.json();
            console.log('Backend Response:', data);

            if (data && data.learningPath) {
                const learningPathArray = data.learningPath.split('\n').filter(item => item.trim() !== '');
                const learningPathString = encodeURIComponent(JSON.stringify(learningPathArray));
                const learningPathURL = `PlanPage.html?path=${learningPathString}`;
                window.location.href = learningPathURL;
            } else {
                alert('an error occured');
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            alert('an error occured');
        }
    });
});