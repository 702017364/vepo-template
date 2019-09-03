import cli from 'cli-color';

export default class Logger{
  constructor(type = 'image'){
    this.type = type;
    this.#logStart();
  }

  then(){
    this.#logFinish();
  }

  #logStart(){
    const time = this.time = new Date();
    Logger.log(time, 'Starting', this.type, '...');
  }

  #logFinish(){
    const time = new Date();
    const jet = time - this.time;
    const xterm = cli.xterm(56)(`${jet} ms`);
    Logger.log(time, 'Finished', this.type, ` after ${xterm}`);
  }

  static log(time, status, type, other){
    time = Logger.time(time);
    type = cli.xterm(45)(type);
    console.log(`[${time}] ${status} '${type}'${other}`);
  }

  static time(time){
    const value = [
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
    ].map((value) => `0${value}`.slice(-2)).join(':');
    return cli.xterm(8)(value);
  }
}