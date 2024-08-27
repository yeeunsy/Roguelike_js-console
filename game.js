// ------ game.js
import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { enterVillage } from './village.js';

// 플레이어
class Player {
  constructor() {
    this._maxHp = 150;        // 플레이어 최대 체력
    this._hp = this._maxHp;   // 플레이어 체력
    this._str = 50;           // 플레이어 초기 공격력
    this._stones = 0;         // 플레이어가 가지고 있는 당근 개수
    this._level = 1;          // 플레이어 강화 초기 레벨
  }

  attack(monster) { // 공격 시 데미지 만큼 몬스터의 체력을 깎기 위해 monser객체에 접근해서 _mhp의 값을 업데이트 해주기 위한 메서드

    // 플레이어의 공격
    let damage = Math.floor(Math.random() * this._str) + 1; // 몬스터에게 랜덤한 피해를 입히기 위한 선언
    monster._mhp -= damage; // monster객체와 상호작용

    return damage;
  }
}

// 몬스터
class Monster {
  constructor(stage) {  // 스테이지가 끝날 때 마다 스테이지를 인자로 받는 몬스터가 새로 생성
    // 해당 스테이지 값을 가져와 몬스터의 피와 데미지 증가
    this._mhp = 100 + stage * 2;
    this._mstr = 20 + stage * 2;
  }

  attack(player) { // 플레이어와 동일한 메서드

    // 몬스터의 공격
    let damage = Math.floor(Math.random() * this._mstr); // 랜덤한 데미지
    player._hp -= damage;

    return damage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 HP : ${player._hp} | STR : ${player._str} `,
    ) +
    chalk.redBright(
      `| 몬스터 HP : ${monster._mhp} | STR : ${monster._mstr}`,
    ),
  );
  console.log(chalk.magentaBright(`================================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player._hp > 0 && monster._mhp > 0) { // 플레이어와 몬스터 둘 중 하나가 HP가 0 이하일 때까지 반복
    console.clear();
    displayStatus(stage, player, monster);

    //로그가 너무 길면 삭제. 5개까지만 표시
    while (logs.length > 7) logs.shift()

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격하기 2. 연속 공격 3. 방어하기 4. 도망가기`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    switch (choice) {
      case '1': // 공격하기 
        let res = player.attack(monster); // 데미지 할당
        let mRes = monster.attack(player);
        logs.push(chalk.green(`${res}의 피해를 입혔다 !`));
        logs.push(chalk.green(`몬스터에게 ${mRes}의 피해를 당했다 !`));
        logs.push(`플레이어 HP: ${player._hp}, 몬스터 HP: ${monster._mhp}`);
        break;

      case '2': // 연속 공격
        logs.push(chalk.green(`연속 공격을 선택했다 !`));

        let i = 0;

        while (i < Math.floor(Math.random() * 5) + 1) {
          let res = player.attack(monster); // 플레이어 데미지
          logs.push(chalk.green(`${res}의 피해를 입혔다 !`));
          logs.push(`몬스터 HP: ${monster._mhp}`);
          i++;
        }

        let mRes2 = monster.attack(player); // 몬스터 데미지
        logs.push(chalk.green(`몬스터에게 ${mRes2}의 피해를 당했다 !`));
        logs.push(`플레이어 HP: ${player._hp}`);
        break;

      case '3': // 방어하기
        if ( Math.random() < 0.5 ) { // 50% 확률로 방어 성공
          const reDamage = Math.floor(monster.attack(player) * 0.2); // 방어 성공 시 80%의 피해 감소
          player._hp -= reDamage;
          logs.push(chalk.blue(`방어에 성공하여 ${reDamage}의 피해만 입었습니다!`));
        } else {
          let damage = monster.attack(player); // 방어 실패 시 데미지 그대로 피격
          logs.push(chalk.red(`방어에 실패하여 ${damage}의 피해를 입었습니다!`));
          logs.push(`플레이어 HP: ${player._hp}, 몬스터 HP: ${monster._mhp}`);
        }
        break;

      case '4': // 도망가기
        if (Math.floor(Math.random() * 100) < 50) {
          logs.push(chalk.green(`도망가지 못했다!`));
          break;
        } else if (Math.floor(Math.random() * 100) >= 50) {
          logs.push(chalk.green(`성공적으로 도망갔다!`));
          return true; // true를 반환하면 다음 스테이지로 넘어간다 (왜지? 알아봐야지)
        }

      default:
        logs.push(chalk.green(`${choice}는 없는 선택지 입니다.`));
        break;
    }

  }

  // while문이 끝나면 ( 배틀이 끝나면 ) 플레이어와 몬스터의 상태 검사

  if ( player._hp > 0 ) {
    console.clear();
    displayStatus(stage, player, monster);

    const stonesGained = Math.floor(Math.random() * 5) + 1; // 강화석 획득
    player._stones += stonesGained;
    console.log(chalk.green(`스테이지 ${stage} 클리어 ! ${stonesGained}개의 강화석을 획득했습니다. 총 강화석 : ${player._stones}`));
    
    const villageChoice = readlineSync.question('계속 진행할까요 ? (y/n): ');

    if ( villageChoice.toLowerCase() === 'y' ) {
      return true; // 스테이지 계속 진행
    } else if ( villageChoice.toLowerCase() === 'n' ) {
      enterVillage(player, stage); // 마을로 진입
    }

  } else if ( player._hp <= 0 ) {
    console.log(chalk.redBright(`플레이어가 사망했습니다. 게임을 종료합니다.`));
    return false; // 게임 종료
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) { // 배틀이 끝나면
    const monster = new Monster(stage);
    const result = await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if (result == false || player._hp <= 0) { // 플레이어가 죽어서 배틀이 끝나면 게임 종료
      process.exit(0);
    }

    // 게임 진행
    console.log(chalk.greenBright(`${stage}스테이지를 클리어했습니다!`));

    const missingHp = player._maxHp - player._hp;
    const heal = Math.floor(missingHp * (Math.random() * 0.5 + 0.5)); // 50% ~ 100% 사이의 랜덤한 회복량
    player._hp = Math.min(player._hp + heal, player._maxHp); // 최대 체력을 넘지 않도록 회복
    console.log(chalk.green(`체력을 ${heal}만큼 회복했습니다! 현재 체력: ${player._hp}`));
    stage++;
  }

  if (player._hp > 0) { // 플레이어가 마지막 스테이지에서 몬스터를 처치했을 때
    console.log(chalk.greenBright(`축하합니다 ! 모든 스테이지를 클리어했습니다 ! 게임을 종료합니다.`));
    process.exit(0);
  }

}