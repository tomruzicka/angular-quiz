import { QuestionService } from './../service/question.service';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  public name: string = '';
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  interval$: any;
  progress: string = '0';
  isQuizCompleted: boolean = false;

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions() {
    this.questionService.getQuestionJson().subscribe((res) => {
      this.questionList = res.questions;
    });
  }

  nextQuestion() {
    this.currentQuestion++;
  }

  previousQuestion() {
    this.currentQuestion--;
  }

  answer(currentQno: number, option: any) {
    if (currentQno === this.questionList.length) {
      this.stopCounter();
      setTimeout(() => {
        this.isQuizCompleted = true;
      }, 1000);
    }
    if (option.correct) {
      this.points += 10;
      this.correctAnswer++;
      this.stopCounter();
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPrecent();
      }, 1000);
    } else {
      this.points -= 10;
      this.incorrectAnswer++;
      this.stopCounter();
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPrecent();
      }, 1000);
    }
  }

  startCounter() {
    this.interval$ = interval(1000).subscribe((val) => {
      this.counter--;
      if (this.counter == 0) {
        this.currentQuestion++;
        this.counter = 60;
        this.points -= 10;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }

  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = '0';
  }

  getProgressPrecent() {
    this.progress = (
      (this.currentQuestion / this.questionList.length) *
      100
    ).toString();
    return this.progress;
  }
}
