   async function buy() {
    var be = true;
    /*var u1 = client.users.cache.get("282859044593598464".replace(/[/<@!>]/g, ''));
    var u2 = client.users.cache.get("608206429576495134".replace(/[/<@!>]/g, ''));
.   var u3 = client.users.cache.get("567703512763334685".replace(/[/<@!>]/g, ''));
    var u4 = client.users.cache.get("919328976432926840".replace(/[/<@!>]/g, ''));
    if (!u1 && !u2 && !u3) be = false;*/
    if (data.getCookies !== null) {
      try {
        noblox.setCookie(data.getCookies.toString());
      } catch{
        be = false;
      }
    } else be = false;
    if (data.getGroup !== null) {
      try {
        var Group = await noblox.getGroup(parseInt(data.getGroup));
      } catch{
        be = false;
      }
    } else be = false;
      if (data.Status === false || be === true){
    }

    var username = null;
    var ho = null;
    var numberP = null;
    var owner = (client.users.cache.get(data.getRecipient.toString().replace(/[/<@!>]/g, ''))) ? data.getRecipient.toString() : message.guild.ownerID;
    var price = null;
    var priceE = null;
    var endprice = null;
    var embed = new Discord.MessageEmbed().setAuthor(lang.buy.reply1).setColor("RANDOM").setDescription(`**لـ الغة العربية اكتب رقم [1]**\n> **For English, choose the number [2] **`);
    var filter = user => user.author.id === message.author.id;
    var count = 0;
    message.channel.send(embed).then(async (msg) => {
      var messages = message.channel.createMessageCollector(filter, { time: 60000 * 5, max: 3 });
      messages.on("collect", async collect => {
        count++;
        var content = collect.content;
        collect.delete();
        if (count === 1) {
          if (parseInt(content) === 1) lang = replys.ar;
          else if (parseInt(content) === 2) lang = replys.en;
          else if (parseInt(content) !== 1 && parseInt(content) !== 2) {
            embed.setColor("RED");
            embed.setDescription(lang.buy.reply2);
            msg.edit(embed);
            cooldown.delete(col);
            messages.stop();
            return;
          }
          if (parseInt(content) === 1 || parseInt(content) === 2) {
            embed.setAuthor(lang.buy.reply1)
            embed.setColor("RANDOM");
            embed.setDescription(lang.buy.reply3);
            msg.edit(embed);
          }
        } else if (count === 2) {
          if (isNaN(content)) {
            embed.setColor("RED");
            embed.setDescription(lang.buy.reply2);
            msg.edit(embed);
            cooldown.delete(col);
            messages.stop();
            return;
          } else {
            if (parseInt(content) < data.getLimit) {
              embed.setColor("RED");
              embed.setDescription(lang.buy.reply4.replace(/\[lim]/g, `${data.getLimit}`))
              msg.edit(embed);
              cooldown.delete(col);
              messages.stop();
              return;
            }
            numberP = parseInt(content);
            price = parseInt(numberP * data.getPrice);
            var role = message.guild.roles.cache.sort((b, a) => b.position + a.position).find(r => r.id === data.getBoostRole);
            if (role) {
              if (message.guild.member(message.author.id).roles.cache.has(role.id)) {
                price = Math.floor(price - price * (parseInt(data.getDiscount) / 100));
              }
            }
            priceE = Math.floor(price * 20 / 19) + 1;
            endprice = Math.floor(priceE - priceE * (5 / 100));
            if (priceE <= 0) { priceE = 1; endprice = 1; }
            noblox.setCookie(data.getCookies.toString()).then(async () => {
              let bla = await noblox.getGroupFunds(parseInt(data.getGroup));
              if (numberP > parseInt(bla)) {
                embed.setColor("RED");
                embed.setDescription(lang.buy.reply12)
                msg.edit(embed);
                cooldown.delete(col);
                messages.stop();
                return;
              }
            }).catch(() => {
              cooldown.delete(col);
            });
            embed.setColor("RANDOM");
            embed.setDescription(lang.buy.reply6 + "\n\n" + lang.buy.reply17.replace(/\[url]/g, `https://www.roblox.com/groups/${data.getGroup.toString()}`));
            msg.edit(embed);
          }
        } else if (count === 3) {
          try {
            var id = await noblox.getIdFromUsername(content.toString());
          } catch {
            embed.setColor("RED")

embed.setDescription(lang.buy.reply7);
            msg.edit(embed);
            cooldown.delete(col);
            messages.stop();
            return;
          }
          username = content.toString();
          var arr = [];
          let groups = await noblox.getGroups(parseInt(id)).then((group) => {
            group.forEach(g => arr.push(g.Id));
          }).catch(() => { });
          if (!arr.includes(parseInt(data.getGroup))) {
            embed = lang.buy.reply10;
            msg.edit(embed);
            cooldown.delete(col);
            messages.stop();
            return;
          }
          ho = id;
          embed.setColor("RANDOM");
          embed.setDescription(`${lang.buy.reply5.replace(/\[mention]/g, `<@${owner}>`).replace(/\[num]/g, `${priceE}`)}`);
          msg.edit(embed);
          mes = message.channel.createMessageCollector(user => user.author.id === `282859044593598464` || user.author.id === `567703512763334685` ||
 user.author.id === `919328976432926840` ||
user.author.id === `608206429576495134`, { time: 60000 * 3 });
          mes.on("collect", collect => {
            if (collect.content.includes(message.author.username) && collect.content.includes(`$${endprice}`) && collect.content.includes(`<@!${owner}>`) || collect.content.includes(`<@${owner}>`)) {
              if (!cooldown.has(col)) {
                mes.stop();
                return;
              }
              noblox.setCookie(data.getCookies.toString()).then((userC) => {
                noblox.groupPayout(parseInt(data.getGroup), parseInt(ho), numberP).then(async () => {
                  var Channel = message.guild.channels.cache.get(data.getThanksRoom);
                  let tu = "";
                  if (Channel) tu = lang.buy.reply16.replace(/\[room]/g, `<#${Channel.id}>`);
                  message.channel.send(lang.buy.reply8 + "\n" + tu);
                  var role = message.guild.roles.cache.sort((b, a) => b.position + a.position).find(r => r.id === data.getRole);
                  if (role) message.member.roles.add(role);
                  setTimeout(() => { message.channel.delete(); }, 10000);
                  cooldown.delete(col);
                  mes.stop();
                  if (data.getGuideRoom !== null) {
                    let ch = message.guild.channels.cache.get(data.getGuideRoom.toString());
                    if (ch) {
                      let th = await
                      
noblox.getPlayerThumbnail(parseInt(ho), "150x150", "png", false, "Headshot").then(async(a) => {
                          let url = "";
                          let bla = await noblox.getGroupFunds(parseInt(data.getGroup));
                          bla = bla.toLocaleString();
                          a.forEach(avatar => url = avatar.imageUrl);
                          const canvas = createCanvas(991, 172);
                          const ctx = canvas.getContext('2d')
                          const background = await loadImage('https://media.discordapp.net/attachments/732868860612444160/887171892040069190/PicsArt_09-14-06.04.09.jpg');
                          ctx.beginPath();
                          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                          ctx.font = '15px impact';
                          ctx.fillStyle = 'black';
                          ctx.fillText(numberP.toLocaleString().toString(), 802.5, 42.4);
                          ctx.font = "650 16px impact";
                          ctx.fillText(numberP.toLocaleString().toString(), 864.5, 82.5);
                          ctx.fillText(bla.toString(), 830.5, 105.7);
                          ctx.font = "570 15.2px impact";
                          ctx.fillText(username.toString(), 61, 35);
                          ctx.closePath();
                          const userImage = await loadImage(url.toString());
                          ctx.drawImage(userImage, 11.5, 16.5, 35, 35);
                          ctx.beginPath();
                          ctx.arc(29, 34, 21, 0, Math.PI * 2, true);
                          ctx.strokeStyle = '#fff';
                          ctx.lineWidth = 7;
                          ctx.stroke();
                          ctx.closePath();
                          ctx.clip();
                          const attach = new MessageAttachment(canvas.toBuffer(), 'payout.png');
                          ch.send(lang.buy.reply11.replace(/\[mention]/g, `<@${message.author.id}>`), attach);
                          cooldown.delete(col);
                        });
                    }
                  }
                }).catch((e) => {
                  console.log(e)
                  if (e.message.includes('Payouts'))
                    return;
                  message.channel.send(lang.buy.reply18);
                  message.channel.setName(`${numberP}r-newtogroup`);
                  cooldown.delete(col);
                });
              }).catch(() => {
                cooldown.delete(col);
              });
              mes.stop();
            }
          });
          mes.on("end", collect => {
            if (cooldown.has(col)) {
              cooldown.delete(col);
              message.reply(lang.buy.reply19);
            }
          });
        }
      });
    });
  }
}
