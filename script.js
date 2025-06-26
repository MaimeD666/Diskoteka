import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue, increment } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDmx77LIC4QnN9W8DkSbjJ3o8TfqgUVtWk",
    authDomain: "penis-78223.firebaseapp.com",
    databaseURL: "https://penis-78223-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "penis-78223",
    storageBucket: "penis-78223.firebasestorage.app",
    messagingSenderId: "30650501218",
    appId: "1:30650501218:web:5dad5e8573df8826f4a93b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

class VotingSystem {
    constructor() {
        this.deviceId = this.getDeviceId();
        this.currentVote = null;
        this.init();
    }

    getDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + Date.now();
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    async init() {
        await this.loadCurrentVote();
        this.updateSelectionDisplay();
        this.setupRealtimeListeners();
        this.attachEventListeners();
        this.setupViewToggle();
    }

    async loadCurrentVote() {
        try {
            const userVoteRef = ref(database, `userVotes/${this.deviceId}`);
            const snapshot = await get(userVoteRef);
            this.currentVote = snapshot.val();
        } catch (error) {
            console.error('Error loading current vote:', error);
        }
    }

    setupRealtimeListeners() {
        const votesRef = ref(database, 'votes');
        onValue(votesRef, (snapshot) => {
            const votes = snapshot.val() || { vanya: 0, kirill: 0, artem: 0 };
            this.updateDisplay(votes);
        });

        const userVoteRef = ref(database, `userVotes/${this.deviceId}`);
        onValue(userVoteRef, (snapshot) => {
            this.currentVote = snapshot.val();
            this.updateSelectionDisplay();
        });
    }

    updateDisplay(votes = null) {
        if (!votes) return;
        
        const total = Object.values(votes).reduce((sum, count) => sum + count, 0);
        document.getElementById('totalVotes').textContent = total;

        document.querySelectorAll('.brother').forEach(brother => {
            const name = brother.dataset.name;
            const voteElement = brother.querySelector('.votes');
            voteElement.textContent = votes[name] || 0;
        });
    }

    updateSelectionDisplay() {
        document.querySelectorAll('.brother').forEach(brother => {
            const name = brother.dataset.name;
            if (this.currentVote === name) {
                brother.classList.add('selected');
            } else {
                brother.classList.remove('selected');
            }
        });
    }

    attachEventListeners() {
        document.querySelectorAll('.brother').forEach(brother => {
            brother.addEventListener('click', () => {
                const name = brother.dataset.name;
                this.vote(name);
            });
        });
    }

    async vote(name) {
        try {
            if (this.currentVote === name) {
                return;
            }

            if (this.currentVote) {
                await set(ref(database, `votes/${this.currentVote}`), increment(-1));
            }
            
            await set(ref(database, `votes/${name}`), increment(1));
            await set(ref(database, `userVotes/${this.deviceId}`), name);
            
            this.animateVote(document.querySelector(`[data-name="${name}"]`));
            
        } catch (error) {
            console.error('Error voting:', error);
        }
    }

    setupViewToggle() {
        const toggle = document.getElementById('viewToggle');
        toggle.addEventListener('change', () => {
            this.switchPhotos(toggle.checked);
        });
    }

    switchPhotos(isNormalView) {
        const suffix = isNormalView ? '1' : '';
        
        document.querySelectorAll('.brother').forEach((brother, index) => {
            const name = brother.dataset.name;
            const img = brother.querySelector('img');
            
            setTimeout(() => {
                img.classList.add('changing');
                
                setTimeout(() => {
                    img.src = `res/${name}${suffix}.jpg`;
                    img.classList.remove('changing');
                }, 200);
            }, index * 100);
        });
    }

    animateVote(element) {
        element.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 100);

        const voteElement = element.querySelector('.votes');
        voteElement.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            voteElement.style.transform = '';
        }, 200);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VotingSystem();
});