import chalk from 'chalk';
import readlineSync from 'readline-sync';

export function enterVillage(player, stage) {
    console.clear();
    console.log(chalk.green(`마을에 도착했습니다. 스테이지 ${stage}의 정보를 저장합니다.`));

    let inVillage = true;
    while (inVillage) {
        console.log(chalk.green('\n1. 강화하기 2. 다음 스테이지로 이동 '));
        const vChoice = readlineSync.question('무엇을 하시겠습니까? ');

        switch (vChoice) {
            case '1':
                strengthen(player);
                break;

            case '2':
                console.log(chalk.blue('마을을 떠납니다.'));
                inVillage = false; // 마을을 떠나 다음 스테이지로 이동
                break;

            default:
                console.log(chalk.red('잘못된 선택입니다.'));
        }
    }
}

function strengthen(player) {
    const dest = player._level * 2; // 강화 비용: 레벨 * 2 강화석
    let beStr = player._str;
    if (player._stones >= dest) {
        player._stones -= dest;
        player._str += player._str * 0.05; // 공격력 5% 증가
        player._level++;
        console.log(chalk.green(`
------------------------- ⯌  강화 성공! ⯌ -------------------------
                  공격력이 ${player._str}로 증가했습니다.
                       ✶ ${beStr} ---> ${player._str} ✶\n
                         현재 강화 레벨 : ${player._level} \n
                          남은 강화석 : ${player._stones}`));
                    } else {
        console.log(chalk.red('강화석이 부족합니다.'));
    }
}